import { Page, Layout, Card, BlockStack, TextField, Select, Button, FormLayout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigation, useSubmit } from "react-router";
import prisma from "../db.server";
import { useState } from "react";

export const loader = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const faq = await prisma.faq.findUnique({
    where: { id: params.id, shop: { shopDomain: session.shop } }
  });
  if (!faq) {
    throw new Response("Not Found", { status: 404 });
  }
  return { faq };
};

export const action = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const intent = formData.get("intent");

  if (intent === "delete") {
    await prisma.faq.delete({
      where: { id: params.id }
    });
    return new Response(null, {
      status: 302,
      headers: { Location: "/app/faqs" },
    });
  }

  const question = formData.get("question");
  const answer = formData.get("answer");
  const visibility = formData.get("visibility");

  await prisma.faq.update({
    where: { id: params.id },
    data: { question, answer, visibility }
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/app/faqs" },
  });
};

export default function EditFaq() {
  const { faq } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSaving = navigation.state === "submitting";

  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [visibility, setVisibility] = useState(faq.visibility);

  const handleSubmit = () => {
    submit({ question, answer, visibility, intent: "update" }, { method: "post" });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      submit({ intent: "delete" }, { method: "post" });
    }
  };

  return (
    <Page
      backAction={{ content: "FAQs", url: "/app/faqs" }}
      title="Edit FAQ"
      primaryAction={{
        content: "Save changes",
        onAction: handleSubmit,
        loading: isSaving,
        disabled: !question || !answer,
      }}
      secondaryActions={[
        {
          content: "Delete",
          destructive: true,
          onAction: handleDelete,
        }
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <FormLayout>
              <TextField
                label="Question"
                value={question}
                onChange={setQuestion}
                autoComplete="off"
              />
              <TextField
                label="Answer"
                value={answer}
                onChange={setAnswer}
                multiline={4}
                autoComplete="off"
              />
              <Select
                label="Visibility"
                options={[
                  { label: "Store-wide (Global)", value: "GLOBAL" },
                  { label: "Specific Products", value: "PRODUCT" },
                  { label: "Specific Collections", value: "COLLECTION" },
                ]}
                value={visibility}
                onChange={setVisibility}
              />
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
