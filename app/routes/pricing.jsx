import { Page, Layout, Card, BlockStack, Text, Button, Grid, List } from "@shopify/polaris";
import { useNavigate } from "react-router";

export default function Pricing() {
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (plan === "FREE") {
      navigate("/app/gallery"); // Or wherever you want to go on free
    } else {
      // Need to redirect to a secure route that handles Shopify Billing API
      // Since this pricing page is public, we cannot use Shopify App Bridge directly here
      // We'll bounce them to our secure app route to handle the upgrade
      window.location.href = `/app/upgrade?plan=${plan}`;
    }
  };

  return (
    <Page title="Plans & Pricing">
      <Layout>
        <Layout.Section>
          <BlockStack gap="400" alignment="center">
            <Text as="h2" variant="headingLg" alignment="center">
              Unlock Premium Features
            </Text>
            <Text as="p" tone="subdued" alignment="center">
              Upgrade your plan to access more templates, product-specific FAQs, and advanced customizations.
            </Text>
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <Grid>
            {/* Free Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <Card>
                <BlockStack gap="400">
                  <Text as="h3" variant="headingMd">Free Plan</Text>
                  <Text as="p" variant="headingXl">₹0 <Text as="span" variant="bodyMd" tone="subdued">/month</Text></Text>
                  <List>
                    <List.Item>3 FAQs</List.Item>
                    <List.Item>Basic Templates</List.Item>
                  </List>
                  <Button
                    fullWidth
                    onClick={() => handleSubscribe("FREE")}
                  >
                    Start Free
                  </Button>
                </BlockStack>
              </Card>
            </Grid.Cell>

            {/* Pro Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <Card>
                <BlockStack gap="400">
                  <Text as="h3" variant="headingMd">Pro</Text>
                  <Text as="p" variant="headingXl">₹49 <Text as="span" variant="bodyMd" tone="subdued">/month</Text></Text>
                  <List>
                    <List.Item>Unlimited FAQs</List.Item>
                    <List.Item>All Template Access</List.Item>
                    <List.Item>Analytics</List.Item>
                    <List.Item>Export</List.Item>
                  </List>
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={() => handleSubscribe("PRO")}
                  >
                    Get Pro
                  </Button>
                </BlockStack>
              </Card>
            </Grid.Cell>

            {/* Premium Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <div style={{ border: "2px solid var(--p-color-border-interactive)", borderRadius: "var(--p-border-radius-200)" }}>
                <Card>
                  <BlockStack gap="400">
                    <Text as="h3" variant="headingMd">Premium</Text>
                    <Text as="p" variant="headingXl">₹99 <Text as="span" variant="bodyMd" tone="subdued">/month</Text></Text>
                    <List>
                      <List.Item>Everything in Pro</List.Item>
                      <List.Item>Priority Support</List.Item>
                      <List.Item>Premium Templates</List.Item>
                    </List>
                    <Button
                      fullWidth
                      variant="primary"
                      tone="success"
                      onClick={() => handleSubscribe("PREMIUM")}
                    >
                      Get Premium
                    </Button>
                  </BlockStack>
                </Card>
              </div>
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
