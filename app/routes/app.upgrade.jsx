import { authenticate } from "../shopify.server";
import { PRO_PLAN, PREMIUM_PLAN } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const planParam = url.searchParams.get("plan");
  
  if (!planParam) {
    return new Response(null, { status: 302, headers: { Location: "/app" } });
  }

  const targetPlan = planParam === "PREMIUM" ? PREMIUM_PLAN : PRO_PLAN;

  await billing.require({
    plans: [targetPlan],
    isTest: true,
    onFailure: async () => billing.request({
      plan: targetPlan,
      isTest: true,
      returnUrl: `${process.env.SHOPIFY_APP_URL}/app/gallery`,
    }),
  });

  // If we reach here, the plan is already active
  await prisma.shop.update({
    where: { shopDomain: session.shop },
    data: { plan: planParam === "PREMIUM" ? "premium" : "pro" }
  });

  return new Response(null, { status: 302, headers: { Location: "/app/gallery" } });
};
