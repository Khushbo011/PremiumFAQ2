import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  Grid,
  IndexTable,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;

  const totalFaqs = await prisma.faq.count({ where: { shop: { shopDomain: shopId } } });
  const productFaqs = await prisma.faq.count({ where: { shop: { shopDomain: shopId }, visibility: "PRODUCT" } });
  const collectionFaqs = await prisma.faq.count({ where: { shop: { shopDomain: shopId }, visibility: "COLLECTION" } });
  
  const recentFaqs = await prisma.faq.findMany({
    where: { shop: { shopDomain: shopId } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { totalFaqs, productFaqs, collectionFaqs, recentFaqs };
};

export default function Dashboard() {
  const { totalFaqs, productFaqs, collectionFaqs, recentFaqs } = useLoaderData();
  const navigate = useNavigate();

  const rowMarkup = recentFaqs.map(({ id, question, visibility }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">{question}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={visibility === "GLOBAL" ? "success" : "info"}>{visibility}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button size="micro" onClick={() => navigate(`/app/faqs/${id}`)}>Edit</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page title="Premium FAQ Dashboard">
      <Layout>
        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm" tone="subdued">Total FAQs</Text>
                  <Text as="p" variant="headingLg">{totalFaqs}</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm" tone="subdued">Product FAQs</Text>
                  <Text as="p" variant="headingLg">{productFaqs}</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm" tone="subdued">Collection FAQs</Text>
                  <Text as="p" variant="headingLg">{collectionFaqs}</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
              <Card>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm" tone="subdued">Total Views</Text>
                  <Text as="p" variant="headingLg">0</Text>
                </BlockStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">Quick Actions</Text>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button onClick={() => navigate("/app/faqs")} variant="primary">Manage FAQs</Button>
                <Button onClick={() => navigate("/app/gallery")}>Browse Templates</Button>
                <Button onClick={() => navigate("/app/pricing")}>Upgrade Plan</Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card padding="0">
            <BlockStack gap="400" padding="400">
              <Text as="h2" variant="headingMd">Recent FAQs</Text>
            </BlockStack>
            {recentFaqs.length > 0 ? (
              <IndexTable
                resourceName={{ singular: "FAQ", plural: "FAQs" }}
                itemCount={recentFaqs.length}
                headings={[{ title: "Question" }, { title: "Visibility" }, { title: "Actions" }]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable>
            ) : (
              <BlockStack padding="400" alignment="center">
                <Text as="p" tone="subdued">No FAQs created yet.</Text>
                <div style={{ marginTop: "16px" }}>
                  <Button variant="primary" onClick={() => navigate("/app/faqs/new")}>Create your first FAQ</Button>
                </div>
              </BlockStack>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
