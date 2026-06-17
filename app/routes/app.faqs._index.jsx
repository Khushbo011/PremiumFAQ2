import { Page, Layout, Card, BlockStack, Text, Button, IndexTable, Badge } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;

  const faqs = await prisma.faq.findMany({
    where: { shop: { shopDomain: shopId } },
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return { faqs };
};

export default function FaqList() {
  const { faqs } = useLoaderData();
  const navigate = useNavigate();

  const rowMarkup = faqs.map(
    ({ id, question, visibility, category, order }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {question}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{category?.title || "None"}</IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone={visibility === "GLOBAL" ? "success" : "info"}>
            {visibility}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{order}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button size="micro" onClick={() => navigate(`/app/faqs/${id}`)}>
            Edit
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Page
      backAction={{ content: "Dashboard", onAction: () => navigate("/app") }}
      title="FAQ Management"
      primaryAction={{
        content: "Create FAQ",
        onAction: () => navigate("/app/faqs/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {faqs.length > 0 ? (
              <IndexTable
                resourceName={{ singular: "FAQ", plural: "FAQs" }}
                itemCount={faqs.length}
                headings={[
                  { title: "Question" },
                  { title: "Category" },
                  { title: "Visibility" },
                  { title: "Order" },
                  { title: "Actions" },
                ]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable>
            ) : (
              <BlockStack padding="400" alignment="center">
                <Text as="p" tone="subdued">
                  You haven't created any FAQs yet.
                </Text>
                <div style={{ marginTop: "16px" }}>
                  <Button variant="primary" onClick={() => navigate("/app/faqs/new")}>
                    Create your first FAQ
                  </Button>
                </div>
              </BlockStack>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
