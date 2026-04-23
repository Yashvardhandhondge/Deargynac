import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const GET = auth(async (req) => {
  const session = req.auth;
  const userRole = (session?.user as any)?.role;
  if (!session?.user || (userRole !== "doctor" && userRole !== "radiologist")) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const doctorId = (session.user as any).userId || (session.user as any).id;

  try {
    await connectDB();
    const doctor = await User.findById(doctorId).select("availableSlots").lean();
    return Response.json({ success: true, slots: (doctor as any)?.availableSlots || [] });
  } catch (error) {
    console.error("Schedule fetch error:", error);
    return Response.json({ success: false, message: "Failed to fetch schedule" }, { status: 500 });
  }
}) as any;

export const PATCH = auth(async (req) => {
  const session = req.auth;
  const userRole = (session?.user as any)?.role;
  if (!session?.user || (userRole !== "doctor" && userRole !== "radiologist")) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const doctorId = (session.user as any).userId || (session.user as any).id;

  try {
    const { availableSlots } = await req.json();
    await connectDB();
    await User.findByIdAndUpdate(doctorId, { availableSlots });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Schedule update error:", error);
    return Response.json({ success: false, message: "Failed to update schedule" }, { status: 500 });
  }
}) as any;
