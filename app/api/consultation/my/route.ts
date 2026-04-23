import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = (session.user as any).userId || (session.user as any).id;

  try {
    await connectDB();

    const consultations = await Consultation.find({ patientId: userId })
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return Response.json({ success: true, consultations });
  } catch (error) {
    console.error("Fetch consultations error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}) as any;
