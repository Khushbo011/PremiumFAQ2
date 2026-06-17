import { authenticate } from "../shopify.server";
import { PRO_PLAN, PREMIUM_PLAN } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const planParam = url.searchParams.get("plan")?.toUpperCase();
  
  if (!planParam) {
    return new Response(null, { status: 302, headers: { Location: "/app" } });
  }

  // Handle Free Plan downgrade directly
  if (planParam === "FREE") {
    await prisma.shop.update({
      where: { shopDomain: session.shop },
      data: { plan: "FREE" }
    });
    return new Response(null, { status: 302, headers: { Location: "/app/gallery" } });
  }

  const targetPlan = planParam === "PREMIUM" ? PREMIUM_PLAN : PRO_PLAN;

  // This will throw a redirect if billing needs to be requested, which Shopify handles
  await billing.require({
    plans: [targetPlan],
    isTest: true,
    onFailure: async () => billing.request({
      plan: targetPlan,
      isTest: true,
      returnUrl: `${process.env.SHOPIFY_APP_URL}/app/upgrade?plan=${planParam}`,
    }),
  });

  // If we reach here, the plan is already active on Shopify, so we update the local DB
  await prisma.shop.update({
    where: { shopDomain: session.shop },
    data: { plan: planParam }
  });

  return new Response(null, { status: 302, headers: { Location: "/app/gallery" } });
};
