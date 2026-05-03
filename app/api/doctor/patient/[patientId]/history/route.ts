import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";
import { User } from "@/models/User";

export const GET = auth(async (req) => {
  const session = req.auth;
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "doctor" && role !== "radiologist")) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const idx = segments.indexOf("patient");
  const patientId = idx >= 0 ? segments[idx + 1] : null;

  if (!patientId) {
    return Response.json({ success: false, message: "Missing patient id" }, { status: 400 });
  }

  try {
    await connectDB();

    const [consultations, patient] = await Promise.all([
      Consultation.find({ patientId })
        .populate("doctorId", "name specialty")
        .populate("prescription")
        .sort({ createdAt: -1 })
        .lean(),
      User.findById(patientId)
        .select("name alias isAnonymous phone createdAt")
        .lean(),
    ]);

    const conds = consultations
      .map((c: any) => c.condition)
      .filter(Boolean) as string[];
    const conditions = [...new Set(conds)];

    const prescriptionCount = consultations.filter((c: any) => c.prescription).length;

    return Response.json(
      {
        success: true,
        patient,
        consultations,
        totalCount: consultations.length,
        prescriptionCount,
        conditions,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Doctor patient history error:", error);
    return Response.json({ success: false, message: "Failed to fetch history" }, { status: 500 });
  }
}) as any;
