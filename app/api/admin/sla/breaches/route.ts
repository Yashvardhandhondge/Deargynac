import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const breaches = await Consultation.find({
      status: { $in: ["pending", "active"] },
      responseDeadline: { $lt: new Date() },
    })
      .populate("patientId", "name alias isAnonymous")
      .populate("doctorId", "name")
      .sort({ responseDeadline: 1 })
      .lean();

    return Response.json({ success: true, breaches }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' },
    });
  } catch (error) {
    console.error("SLA breaches error:", error);
    return Response.json({ success: false, message: "Failed" }, { status: 500 });
  }
}) as any;
