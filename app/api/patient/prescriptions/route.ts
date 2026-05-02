import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Prescription } from "@/models/Prescription";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if ((session.user as any).role !== "patient") {
    return Response.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const userId = (session.user as any).userId || (session.user as any).id;

  try {
    await connectDB();

    const prescriptions = await Prescription.find({ patientId: userId })
      .populate("doctorId", "name specialty mrnNumber")
      .populate("consultationId", "condition status createdAt")
      .sort({ issuedAt: -1 })
      .lean();

    return Response.json(
      { success: true, prescriptions },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Patient prescriptions error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch prescriptions" },
      { status: 500 }
    );
  }
}) as any;
