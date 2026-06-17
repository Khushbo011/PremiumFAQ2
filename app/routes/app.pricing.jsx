import { Page, Layout, Card, BlockStack, Text, Button, Grid, Box, Divider, Badge } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { useNavigate, useLoaderData } from "react-router";
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

export default function Pricing() {
  const { plan } = useLoaderData();
  const navigate = useNavigate();

  const handleSubscribe = (targetPlan) => {
    navigate(`/app/upgrade?plan=${targetPlan}`);
  };

  const currentPlan = plan ? plan.toUpperCase() : "FREE";

  return (
    <Page title="Plans & Pricing">
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="600">
            <BlockStack gap="300" align="center" inlineAlign="center">
              <Text as="h1" variant="heading2xl" alignment="center">
                Choose the Perfect Plan for Your Store
              </Text>
              <Text as="p" tone="subdued" variant="bodyLg" alignment="center">
                Upgrade your store with premium FAQ templates, advanced styling, and priority support.
              </Text>
            </BlockStack>
          </Box>
        </Layout.Section>

        <Layout.Section>
          <Grid>
            {/* Free Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <Card roundedUp="lg">
                <Box padding="600">
                  <BlockStack gap="500">
                    <BlockStack gap="200" align="center" inlineAlign="center">
                      <Text as="h3" variant="headingLg" alignment="center">
                        Free Plan
                      </Text>
                      <Text as="p" variant="heading3xl" alignment="center">
                        $0
                        <Text as="span" variant="bodyMd" tone="subdued">
                          /month
                        </Text>
                      </Text>
                    </BlockStack>
                    <Divider />
                    <BlockStack gap="200">
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                        <Text as="p">1 FAQ Template (Classic Accordion)</Text>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                        <Text as="p">Create up to 3 FAQs</Text>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                        <Text as="p">Basic Customization</Text>
                      </div>
                    </BlockStack>
                    {currentPlan === "FREE" ? (
                      <Button fullWidth disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button fullWidth onClick={() => handleSubscribe("FREE")}>
                        Downgrade to Free
                      </Button>
                    )}
                  </BlockStack>
                </Box>
              </Card>
            </Grid.Cell>

            {/* Pro Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <Card roundedUp="lg">
                <Box padding="600">
                  <BlockStack gap="500">
                    <BlockStack gap="200" align="center" inlineAlign="center">
                      <Text as="h3" variant="headingLg" alignment="center">
                        Pro Plan
                      </Text>
                      <Text as="p" variant="heading3xl" alignment="center">
                        $49
                        <Text as="span" variant="bodyMd" tone="subdued">
                          /month
                        </Text>
                      </Text>
                    </BlockStack>
                    <Divider />
                    <BlockStack gap="200">
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                        <Text as="p">4 FAQ Templates (Classic, Modern, Minimal, Cards)</Text>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                        <Text as="p">Unlimited FAQs & Categories</Text>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                        <Text as="p">Advanced Customization Panel</Text>
                      </div>
                    </BlockStack>
                    {currentPlan === "PRO" ? (
                      <Button fullWidth disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button fullWidth variant="primary" onClick={() => handleSubscribe("PRO")}>
                        {currentPlan === "PREMIUM" ? "Downgrade to Pro" : "Upgrade to Pro"}
                      </Button>
                    )}
                  </BlockStack>
                </Box>
              </Card>
            </Grid.Cell>

            {/* Premium Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }}>
              <div
                style={{
                  border: "2px solid var(--p-color-border-interactive)",
                  borderRadius: "var(--p-border-radius-300)",
                  overflow: "hidden"
                }}
              >
                <Card roundedUp="lg">
                  <Box padding="600">
                    <BlockStack gap="500">
                      <BlockStack gap="200" align="center" inlineAlign="center">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Badge tone="attention">MOST POPULAR</Badge>
                        </div>
                        <Text as="h3" variant="headingLg" alignment="center">
                          Premium Plan
                        </Text>
                        <Text as="p" variant="heading3xl" alignment="center">
                          $99
                          <Text as="span" variant="bodyMd" tone="subdued">
                            /month
                          </Text>
                        </Text>
                      </BlockStack>
                      <Divider />
                      <BlockStack gap="200">
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                          <Text as="p">All 8 Premium Templates Unlocked</Text>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                          <Text as="p">Everything in Pro Plan</Text>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: 'var(--p-color-text-success)' }}>✓</span>
                          <Text as="p">Priority Email & Chat Support</Text>
                        </div>
                      </BlockStack>
                      {currentPlan === "PREMIUM" ? (
                        <Button fullWidth disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="primary"
                          tone="success"
                          onClick={() => handleSubscribe("PREMIUM")}
                        >
                          Upgrade to Premium
                        </Button>
                      )}
                    </BlockStack>
                  </Box>
                </Card>
              </div>
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
