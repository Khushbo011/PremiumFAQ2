import { Page, Layout, Card, BlockStack, Text, Button, Badge, Grid } from "@shopify/polaris";
import { useParams, useNavigate } from "react-router";

const TEMPLATES = {
  "1": { name: "Classic Accordion", description: "Standard, clean expanding accordion.", tone: "info", tier: "FREE" },
  "2": { name: "Modern Accordion", description: "Smooth animations with a modern touch.", tone: "success", tier: "STARTER" },
  "3": { name: "Minimal FAQ", description: "Stripped back, focus purely on content.", tone: "attention", tier: "STARTER" },
  "4": { name: "Premium Cards", description: "Each FAQ gets a beautiful isolated card.", tone: "new", tier: "STARTER" },
  "5": { name: "Tabs FAQ", description: "Organize categories perfectly with tabs.", tone: "info", tier: "PRO" },
  "6": { name: "Elegant FAQ", description: "High-end serif typography and styling.", tone: "critical", tier: "PRO" },
  "7": { name: "Glassmorphism FAQ", description: "Trendy frosted glass effect.", tone: "success", tier: "PRO" },
  "8": { name: "Enterprise FAQ", description: "Dense layout for a large amount of FAQs.", tone: "new", tier: "PRO" },
};

import { AppProvider as PolarisAppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";

export default function TemplatePreviewPublic() {
  const params = useParams();
  const navigate = useNavigate();
  const templateId = params.id;
  const template = TEMPLATES[templateId] || TEMPLATES["1"];

  const handleUseTemplate = () => {
    if (template.tier === "FREE") {
      navigate(`/app/templates/${templateId}`);
    } else {
      window.location.href = `/pricing?template=${templateId}`;
    }
  };

  return (
    <PolarisAppProvider i18n={translations}>
    <div style={{ background: "#f4f6f8", minHeight: "100vh", padding: "40px 20px" }}>
      <Page title={`${template.name} Preview`} backAction={{ content: 'Back', onAction: () => navigate(-1) }}>
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingLg">{template.name}</Text>
                    <Text tone="subdued" as="p">{template.description}</Text>
                  </BlockStack>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <Badge tone={template.tier === "FREE" ? "info" : (template.tier === "PRO" ? "success" : "new")}>
                      {template.tier} Plan
                    </Badge>
                    <Button variant="primary" onClick={handleUseTemplate}>
                      Use Template
                    </Button>
                  </div>
                </div>

                {/* Preview Window Simulator */}
                <div style={{ 
                  border: "1px solid #ebebeb", 
                  borderRadius: "8px", 
                  background: "#fff", 
                  overflow: "hidden",
                  marginTop: "20px"
                }}>
                  <div style={{ background: "#f4f6f8", padding: "10px", borderBottom: "1px solid #ebebeb", display: "flex", gap: "6px" }}>
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f56" }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ffbd2e" }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: "#27c93f" }}></div>
                  </div>
                  <div style={{ padding: "60px 40px", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BlockStack gap="400" alignment="center">
                      <Text as="h3" variant="headingXl">Premium FAQ Live Preview</Text>
                      <Text tone="subdued">This is a full-screen interactive preview of {template.name}.</Text>
                      
                      <div style={{ width: "100%", maxWidth: "600px", marginTop: "30px", border: "1px solid #eee", borderRadius: "8px" }}>
                        <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
                          <Text variant="headingMd">What is your return policy?</Text>
                        </div>
                        <div style={{ padding: "20px", borderBottom: "1px solid #eee" }}>
                          <Text variant="headingMd">How long does shipping take?</Text>
                        </div>
                        <div style={{ padding: "20px" }}>
                          <Text variant="headingMd">Do you offer premium templates?</Text>
                        </div>
                      </div>
                    </BlockStack>
                  </div>
                </div>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
    </PolarisAppProvider>
  );
}
