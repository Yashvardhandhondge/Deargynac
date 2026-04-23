import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const PATCH = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).userId || (session.user as any).id;

  try {
    await connectDB();
    const body = await req.json();
    const { name, email } = body;

    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).lean();

    return Response.json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}) as any;
