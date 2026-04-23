import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

export const GET = auth(async (req) => {
  const session = req.auth;
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "doctor" && role !== "radiologist")) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const doctorId = (session.user as any).userId || (session.user as any).id;

  try {
    await connectDB();

    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status");
    const statuses = statusParam ? statusParam.split(",") : ["active", "pending"];

    const consultations = await Consultation.find({
      doctorId,
      status: { $in: statuses },
    })
      .populate("patientId", "name alias isAnonymous phone")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ success: true, consultations }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' },
    });
  } catch (error) {
    console.error("Doctor consultations error:", error);
    return Response.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}) as any;
