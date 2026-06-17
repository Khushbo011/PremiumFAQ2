import { Page, Layout, Card, BlockStack, Text, Button, Grid, Badge, List } from "@shopify/polaris";
import { authenticate, STARTER_PLAN, PRO_PLAN } from "../shopify.server";
import { useLoaderData, useSubmit, useNavigation } from "react-router";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const shopId = session.shop;

  // Check active subscription
  const billingCheck = await billing.check({
    plans: [STARTER_PLAN, PRO_PLAN],
    isTest: true,
  });

  const activeSubscriptions = billingCheck.appSubscriptions;
  let currentPlan = "Free Plan";
  
  if (activeSubscriptions.some(sub => sub.name === PRO_PLAN)) {
    currentPlan = PRO_PLAN;
  } else if (activeSubscriptions.some(sub => sub.name === STARTER_PLAN)) {
    currentPlan = STARTER_PLAN;
  }

  // Sync DB
  await prisma.shop.update({
    where: { shopDomain: shopId },
    data: { plan: currentPlan === PRO_PLAN ? "PRO" : (currentPlan === STARTER_PLAN ? "STARTER" : "FREE") }
  });

  return { currentPlan };
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = formData.get("plan");

  if (plan === "FREE") {
    // Cancel all subscriptions
    const billingCheck = await billing.check({ plans: [STARTER_PLAN, PRO_PLAN], isTest: true });
    for (const sub of billingCheck.appSubscriptions) {
      await billing.cancel({
        subscriptionId: sub.id,
        isTest: true,
        prorate: true,
      });
    }
    return new Response(null, { status: 302, headers: { Location: "/app/pricing" } });
  }

  const targetPlan = plan === "PRO" ? PRO_PLAN : STARTER_PLAN;

  await billing.require({
    plans: [targetPlan],
    isTest: true,
    onFailure: async () => billing.request({
      plan: targetPlan,
      isTest: true,
      returnUrl: `${process.env.SHOPIFY_APP_URL}/app/pricing`,
    }),
  });

  return new Response(null, { status: 302, headers: { Location: "/app/pricing" } });
};

export default function Pricing() {
  const { currentPlan } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const handleSubscribe = (plan) => {
    submit({ plan }, { method: "post" });
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
                    <List.Item>1 Basic Template</List.Item>
                    <List.Item>Global FAQs Only</List.Item>
                    <List.Item>Limited to 10 FAQs</List.Item>
                  </List>
                  <Button
                    fullWidth
                    disabled={currentPlan === "Free Plan"}
                    onClick={() => handleSubscribe("FREE")}
                    loading={isLoading}
                  >
                    {currentPlan === "Free Plan" ? "Current Plan" : "Downgrade"}
                  </Button>
                </BlockStack>
              </Card>
            </Grid.Cell>

            {/* Starter Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <Card background={currentPlan === STARTER_PLAN ? "bg-surface-active" : "bg-surface"}>
                <BlockStack gap="400">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text as="h3" variant="headingMd">Starter</Text>
                    {currentPlan === STARTER_PLAN && <Badge tone="success">Active</Badge>}
                  </div>
                  <Text as="p" variant="headingXl">₹49 <Text as="span" variant="bodyMd" tone="subdued">/month</Text></Text>
                  <List>
                    <List.Item>4 Premium Templates</List.Item>
                    <List.Item>Product & Collection FAQs</List.Item>
                    <List.Item>Unlimited FAQs</List.Item>
                  </List>
                  <Button
                    fullWidth
                    variant={currentPlan === STARTER_PLAN ? "secondary" : "primary"}
                    disabled={currentPlan === STARTER_PLAN}
                    onClick={() => handleSubscribe("STARTER")}
                    loading={isLoading}
                  >
                    {currentPlan === STARTER_PLAN ? "Current Plan" : "Upgrade to Starter"}
                  </Button>
                </BlockStack>
              </Card>
            </Grid.Cell>

            {/* Pro Plan */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <div style={{ border: "2px solid var(--p-color-border-interactive)", borderRadius: "var(--p-border-radius-200)" }}>
                <Card>
                  <BlockStack gap="400">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text as="h3" variant="headingMd">Pro</Text>
                      {currentPlan === PRO_PLAN ? <Badge tone="success">Active</Badge> : <Badge tone="new">Recommended</Badge>}
                    </div>
                    <Text as="p" variant="headingXl">₹99 <Text as="span" variant="bodyMd" tone="subdued">/month</Text></Text>
                    <List>
                      <List.Item>All 8 Premium Templates</List.Item>
                      <List.Item>Advanced Analytics</List.Item>
                      <List.Item>FAQ Search Integration</List.Item>
                      <List.Item>Priority Support</List.Item>
                    </List>
                    <Button
                      fullWidth
                      variant={currentPlan === PRO_PLAN ? "secondary" : "primary"}
                      disabled={currentPlan === PRO_PLAN}
                      onClick={() => handleSubscribe("PRO")}
                      loading={isLoading}
                    >
                      {currentPlan === PRO_PLAN ? "Current Plan" : "Upgrade to Pro"}
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
