import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { resolveRefId } from "@/lib/resolveRefId";
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
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    await connectDB();

    const consultation = await Consultation.findById(id)
      .populate("doctorId", "name specialty bio rating mrnNumber")
      .populate("patientId", "name alias isAnonymous phone createdAt")
      .populate("prescription")
      .lean();

    if (!consultation) {
      return Response.json(
        { success: false, message: "Consultation not found" },
        { status: 404 }
      );
    }

    const c = consultation as any;
    const patientRef = resolveRefId(c.patientId);
    const doctorRef = resolveRefId(c.doctorId);
    if (patientRef !== userId && doctorRef !== userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    return Response.json({ success: true, consultation });
  } catch (error) {
    console.error("Fetch consultation error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch consultation" },
      { status: 500 }
    );
  }
}) as any;
