import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

export const PATCH = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.indexOf("consultation") + 1];

  try {
    const { doctorId } = await req.json();
    await connectDB();

    await Consultation.findByIdAndUpdate(id, {
      doctorId,
      responseDeadline: new Date(Date.now() + 15 * 60 * 1000),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Reassign error:", error);
    return Response.json({ success: false, message: "Failed to reassign" }, { status: 500 });
  }
}) as any;
