import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

const validStatuses = ["pending", "active", "completed", "escalated", "cancelled"];

export const PATCH = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "doctor") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.indexOf("consultation") + 1];

  try {
    const { status } = await req.json();

    if (!validStatuses.includes(status)) {
      return Response.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    await connectDB();
    await Consultation.findByIdAndUpdate(id, { status });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Status update error:", error);
    return Response.json({ success: false, message: "Failed to update status" }, { status: 500 });
  }
}) as any;
