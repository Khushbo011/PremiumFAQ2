import { Page, Layout, Text, Card, BlockStack, Grid, Button, Badge, Box, Divider } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;

  let shop = await prisma.shop.findUnique({ where: { shopDomain: shopId } });
  if (!shop) {
    shop = await prisma.shop.create({ data: { shopDomain: shopId } });
  }

  return { plan: shop.plan };
};

const TEMPLATES = [
  { id: "1", name: "Classic Accordion", description: "Standard, clean expanding accordion.", tone: "info", tier: "FREE" },
  { id: "2", name: "Modern Accordion", description: "Smooth animations with a modern touch.", tone: "success", tier: "STARTER" },
  { id: "3", name: "Minimal FAQ", description: "Stripped back, focus purely on content.", tone: "attention", tier: "STARTER" },
  { id: "4", name: "Premium Cards", description: "Each FAQ gets a beautiful isolated card.", tone: "new", tier: "STARTER" },
  { id: "5", name: "Tabs FAQ", description: "Organize categories perfectly with tabs.", tone: "info", tier: "PRO" },
  { id: "6", name: "Elegant FAQ", description: "High-end serif typography and styling.", tone: "critical", tier: "PRO" },
  { id: "7", name: "Glassmorphism FAQ", description: "Trendy frosted glass effect.", tone: "success", tier: "PRO" },
  { id: "8", name: "Enterprise FAQ", description: "Dense layout for a large amount of FAQs.", tone: "new", tier: "PRO" },
];

export default function Gallery() {
  const { plan } = useLoaderData();
  const navigate = useNavigate();

  const isUnlocked = (tier) => {
    const currentPlan = (plan || "FREE").toUpperCase();
    if (currentPlan === "PREMIUM") return true;
    if (currentPlan === "PRO" && (tier === "FREE" || tier === "STARTER")) return true;
    if (currentPlan === "FREE" && tier === "FREE") return true;
    return false;
  };

  return (
    <Page title="Templates Gallery">
      <Layout>
        <Layout.Section>
          <Grid>
            {TEMPLATES.map((template) => {
              const unlocked = isUnlocked(template.tier);

              return (
                <Grid.Cell key={template.id} columnSpan={{ xs: 6, sm: 3, md: 4, lg: 4, xl: 4 }}>
                  <Card padding="0">
                    <Box padding="400">
                      <BlockStack gap="300">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Text as="h3" variant="headingMd">{template.name}</Text>
                          <Badge tone={unlocked ? "success" : "critical"}>
                            {template.tier}
                          </Badge>
                        </div>
                        <Text as="p" tone="subdued" variant="bodyMd">
                          {template.description}
                        </Text>
                      </BlockStack>
                    </Box>
                    
                    <div style={{ 
                      height: "180px", 
                      background: "#f4f6f8", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      borderTop: "1px solid #ebebeb",
                      borderBottom: "1px solid #ebebeb",
                      position: "relative"
                    }}>
                      <Text as="p" tone="subdued">Preview Thumbnail Visible For Everyone</Text>
                      {!unlocked && (
                        <div style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          zIndex: 1
                        }}>
                          <Text variant="bodySm" as="span" style={{ color: "white" }}>🔒</Text>
                          <Text variant="bodySm" as="span" style={{ color: "white" }}>Upgrade Required</Text>
                        </div>
                      )}
                    </div>

                    <Box padding="400">
                      <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
                        <Button 
                          onClick={() => navigate(`/templates/${template.id}/preview`)}
                        >
                          Full Page Preview
                        </Button>

                        {!unlocked ? (
                          <Button 
                            variant="primary" 
                            tone="success"
                            onClick={() => navigate(`/app/pricing?template=${template.id}`)}
                          >
                            Upgrade Required
                          </Button>
                        ) : (
                          <Button 
                            variant="primary" 
                            onClick={() => navigate(`/app/templates/${template.id}`)}
                          >
                            Use Template
                          </Button>
                        )}
                      </div>
                    </Box>
                  </Card>
                </Grid.Cell>
              );
            })}
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
