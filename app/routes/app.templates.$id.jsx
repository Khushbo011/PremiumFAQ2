import { Page, Layout, Card, BlockStack, Text, Button, TextField, Select, Grid, RangeSlider, ColorPicker, hsbToHex, hexToRgb } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";
import { useState } from "react";
import prisma from "../db.server";

export const loader = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;
  
  let settings = await prisma.faqSettings.findUnique({ where: { shopId } });
  let shop = await prisma.shop.findUnique({ where: { shopDomain: shopId } });
  
  if (!shop) {
    shop = await prisma.shop.create({ data: { shopDomain: shopId } });
  }
  if (!settings) {
    settings = await prisma.faqSettings.create({ data: { shopId: shop.id } });
  }

  const templateId = parseInt(params.id, 10);
  const plan = shop.plan;
  
  let isAllowed = false;
  if (plan === "PRO") isAllowed = true;
  if (plan === "STARTER" && templateId <= 4) isAllowed = true;
  if (plan === "FREE" && templateId === 1) isAllowed = true;

  if (!isAllowed) {
    throw new Response("Upgrade required to access this template", {
      status: 302,
      headers: { Location: "/app/pricing" }
    });
  }

  // Sample FAQs for preview
  const previewFaqs = [
    { question: "What is your return policy?", answer: "We offer a 30-day money back guarantee on all premium plans." },
    { question: "How do I install the widget?", answer: "Simply go to your Theme Editor, click App Embeds, and enable Premium FAQ." },
    { question: "Can I customize the colors?", answer: "Yes, you can customize all colors, fonts, and spacing right from this panel." },
  ];

  return { templateId: params.id, settings, previewFaqs };
};

export default function TemplatePreview() {
  const { templateId, settings, previewFaqs } = useLoaderData();
  const navigate = useNavigate();
  const shopify = useAppBridge();

  // State for real-time customization
  const [primaryColor, setPrimaryColor] = useState({ hue: 200, brightness: 1, saturation: 1, alpha: 1 });
  const [backgroundColor, setBackgroundColor] = useState({ hue: 0, brightness: 1, saturation: 0, alpha: 1 });
  const [textColor, setTextColor] = useState({ hue: 0, brightness: 0.2, saturation: 0, alpha: 1 });
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState(8);

  const handleSave = () => {
    // We would submit this to an action to save FaqSettings, including the active templateId
    shopify.toast.show("Settings saved and template applied!");
    navigate("/app/gallery");
  };

  const primaryHex = hsbToHex(primaryColor);
  const bgHex = hsbToHex(backgroundColor);
  const textHex = hsbToHex(textColor);

  // Template render logic
  const renderTemplate = () => {
    return (
      <div style={{
        backgroundColor: bgHex,
        padding: '40px',
        minHeight: '400px',
        borderRadius: `${borderRadius}px`,
        boxShadow: templateId === "7" ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)" : "0 4px 12px rgba(0,0,0,0.05)",
        backdropFilter: templateId === "7" ? "blur(4px)" : "none",
        border: templateId === "7" ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid #eaeaea",
      }}>
        <h2 style={{ color: primaryHex, fontSize: `${fontSize * 1.5}px`, marginBottom: '24px', fontWeight: 'bold' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {previewFaqs.map((faq, i) => (
            <div key={i} style={{
              border: templateId === "4" ? "none" : `1px solid ${primaryHex}`,
              borderRadius: `${borderRadius}px`,
              padding: '16px',
              backgroundColor: templateId === "4" ? "#fff" : "transparent",
              boxShadow: templateId === "4" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
            }}>
              <h3 style={{ color: textHex, fontSize: `${fontSize}px`, fontWeight: '600', marginBottom: '8px' }}>
                {faq.question}
              </h3>
              <p style={{ color: textHex, fontSize: `${fontSize * 0.9}px`, opacity: 0.8, margin: 0 }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Page
      backAction={{ content: "Gallery", url: "/app/gallery" }}
      title="Customize Template"
      primaryAction={{
        content: "Apply & Save",
        onAction: handleSave,
      }}
    >
      <Layout>
        <Layout.Section>
          <Grid>
            {/* Customization Sidebar */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <BlockStack gap="400">
                <Card title="Colors">
                  <BlockStack gap="400">
                    <Text variant="headingSm">Primary Color</Text>
                    <ColorPicker onChange={setPrimaryColor} color={primaryColor} allowAlpha />
                    
                    <Text variant="headingSm">Background Color</Text>
                    <ColorPicker onChange={setBackgroundColor} color={backgroundColor} allowAlpha />
                    
                    <Text variant="headingSm">Text Color</Text>
                    <ColorPicker onChange={setTextColor} color={textColor} allowAlpha />
                  </BlockStack>
                </Card>

                <Card title="Typography & Spacing">
                  <BlockStack gap="400">
                    <RangeSlider
                      label="Base Font Size (px)"
                      value={fontSize}
                      onChange={setFontSize}
                      min={12}
                      max={24}
                      output
                    />
                    <RangeSlider
                      label="Border Radius (px)"
                      value={borderRadius}
                      onChange={setBorderRadius}
                      min={0}
                      max={24}
                      output
                    />
                  </BlockStack>
                </Card>
              </BlockStack>
            </Grid.Cell>

            {/* Live Preview */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
              <Card>
                <BlockStack gap="400">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text variant="headingMd">Live Preview</Text>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Button size="micro">Desktop</Button>
                      <Button size="micro" variant="tertiary">Mobile</Button>
                    </div>
                  </div>
                  
                  <div style={{ background: "#f4f6f8", padding: "40px", borderRadius: "12px" }}>
                    {renderTemplate()}
                  </div>
                </BlockStack>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
