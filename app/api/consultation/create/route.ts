import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";
import { resolveNewConsultationPricing } from "@/lib/consultationPricing";

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = (session.user as any).userId || (session.user as any).id;
  const role = (session.user as any).role;

  if (role !== "patient") {
    return Response.json(
      { success: false, message: "Only patients can create consultations" },
      { status: 403 }
    );
  }

  try {
    const { condition, intakeForm, doctorId, type } = await req.json();

    await connectDB();

    const pricing = await resolveNewConsultationPricing(String(userId));

    const consultation = await Consultation.create({
      patientId: userId,
      doctorId,
      condition,
      intakeForm,
      type: type || "async",
      amount: pricing.amount,
      pricingRule: pricing.pricingRule,
      paymentStatus: pricing.paymentStatus,
      status: "active",
      responseDeadline: new Date(Date.now() + 15 * 60 * 1000),
    });

    return Response.json({
      success: true,
      consultationId: consultation._id.toString(),
      amount: pricing.amount,
      pricingRule: pricing.pricingRule,
      standardFee: pricing.standardFee,
    });
  } catch (error: unknown) {
    console.error("Create consultation error:", error);
    const name = error && typeof error === "object" && "name" in error ? (error as { name: string }).name : "";
    if (name === "ValidationError" && error && typeof error === "object" && "message" in error) {
      return Response.json(
        { success: false, message: String((error as { message: string }).message) },
        { status: 400 }
      );
    }
    return Response.json(
      { success: false, message: "Failed to create consultation" },
      { status: 500 }
    );
  }
}) as any;
