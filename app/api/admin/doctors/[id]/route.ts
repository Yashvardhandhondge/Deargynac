import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const PATCH = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const updates = await req.json();
    await connectDB();
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!user) {
      return Response.json({ success: false, message: "Doctor not found" }, { status: 404 });
    }
    return Response.json({ success: true, doctor: user });
  } catch (error) {
    console.error("Update doctor error:", error);
    return Response.json({ success: false, message: "Failed to update" }, { status: 500 });
  }
}) as any;
