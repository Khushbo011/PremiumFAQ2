import { Page, Layout, Card, BlockStack, TextField, Select, Button, FormLayout } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useActionData, useNavigation, Form, useSubmit } from "react-router";
import prisma from "../db.server";
import { useState } from "react";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  
  const question = formData.get("question");
  const answer = formData.get("answer");
  const visibility = formData.get("visibility") || "GLOBAL";
  
  // Create or get the Shop
  let shop = await prisma.shop.findUnique({ where: { shopDomain: session.shop } });
  if (!shop) {
    shop = await prisma.shop.create({ data: { shopDomain: session.shop } });
  }

  const faq = await prisma.faq.create({
    data: {
      shopId: shop.id,
      question,
      answer,
      visibility,
    }
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/app/faqs" },
  });
};

export default function NewFaq() {
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSaving = navigation.state === "submitting";

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [visibility, setVisibility] = useState("GLOBAL");

  const handleSubmit = () => {
    submit({ question, answer, visibility }, { method: "post" });
  };

  return (
    <Page
      backAction={{ content: "FAQs", url: "/app/faqs" }}
      title="Create New FAQ"
      primaryAction={{
        content: "Save FAQ",
        onAction: handleSubmit,
        loading: isSaving,
        disabled: !question || !answer,
      }}
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
