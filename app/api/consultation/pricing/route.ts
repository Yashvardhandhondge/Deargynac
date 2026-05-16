import { auth } from "@/lib/auth";
import { resolveNewConsultationPricing } from "@/lib/consultationPricing";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).userId || (session.user as any).id;
  const role = (session.user as any).role;

  if (role !== "patient") {
    return Response.json(
      { success: false, message: "Only patients can preview consultation pricing" },
      { status: 403 }
    );
  }

  try {
    const pricing = await resolveNewConsultationPricing(String(userId));
    return Response.json(
      {
        success: true,
        ...pricing,
        isFirstConsultFree: pricing.pricingRule === "first_consult_waived",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Consultation pricing preview error:", error);
    return Response.json(
      { success: false, message: "Failed to load pricing" },
      { status: 500 }
    );
  }
}) as any;
