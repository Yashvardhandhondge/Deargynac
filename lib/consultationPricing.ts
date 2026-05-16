import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";
import { STANDARD_ASYNC_CONSULT_FEE_INR } from "@/lib/consultationPricingConstants";

export { STANDARD_ASYNC_CONSULT_FEE_INR } from "@/lib/consultationPricingConstants";

export type ConsultationPricingRule = "standard" | "first_consult_waived";

export interface ResolvedConsultationPricing {
  amount: number;
  pricingRule: ConsultationPricingRule;
  /** Mirrors create flow: demo app marks consult paid on booking; real gateway would gate this. */
  paymentStatus: "paid" | "pending";
  standardFee: number;
}

/**
 * First-ever consultation for this patient is complimentary (telehealth trial).
 * Any prior row counts (including cancelled), so the offer cannot be re-used by rebooking.
 */
export async function resolveNewConsultationPricing(
  patientId: string
): Promise<ResolvedConsultationPricing> {
  await connectDB();
  const priorCount = await Consultation.countDocuments({ patientId });
  if (priorCount === 0) {
    return {
      amount: 0,
      pricingRule: "first_consult_waived",
      paymentStatus: "paid",
      standardFee: STANDARD_ASYNC_CONSULT_FEE_INR,
    };
  }
  return {
    amount: STANDARD_ASYNC_CONSULT_FEE_INR,
    pricingRule: "standard",
    paymentStatus: "paid",
    standardFee: STANDARD_ASYNC_CONSULT_FEE_INR,
  };
}
