import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";
import { Prescription } from "@/models/Prescription";

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "doctor") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const doctorId = (session.user as any).userId || (session.user as any).id;
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.indexOf("consultation") + 1];

  try {
    const { medicines, notes, followUpDate } = await req.json();

    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return Response.json(
        { success: false, message: "At least one medicine is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const consultation = await Consultation.findById(id).lean();
    if (!consultation) {
      return Response.json({ success: false, message: "Not found" }, { status: 404 });
    }

    const prescription = await Prescription.create({
      consultationId: id,
      doctorId,
      patientId: (consultation as any).patientId,
      medicines,
      notes,
      followUpDate: followUpDate || undefined,
      issuedAt: new Date(),
    });

    await Consultation.findByIdAndUpdate(id, {
      prescription: prescription._id,
      status: "completed",
    });

    return Response.json({
      success: true,
      prescriptionId: prescription._id.toString(),
    });
  } catch (error) {
    console.error("Prescribe error:", error);
    return Response.json({ success: false, message: "Failed to issue" }, { status: 500 });
  }
}) as any;
