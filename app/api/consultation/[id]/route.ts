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
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    await connectDB();

    const consultation = await Consultation.findById(id)
      .populate("doctorId", "name specialty bio rating")
      .lean();

    if (!consultation) {
      return Response.json(
        { success: false, message: "Consultation not found" },
        { status: 404 }
      );
    }

    const c = consultation as any;
    if (
      c.patientId.toString() !== userId &&
      c.doctorId?._id?.toString() !== userId
    ) {
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
