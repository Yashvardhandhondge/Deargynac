import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const doctors = await User.find({ role: { $in: ["doctor", "radiologist"] } })
      .sort({ createdAt: -1 })
      .lean();
    return Response.json({ success: true, doctors });
  } catch (error) {
    console.error("Admin doctors error:", error);
    return Response.json({ success: false, message: "Failed" }, { status: 500 });
  }
}) as any;

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, phone, specialty, mrnNumber, experience, bio } = await req.json();

    await connectDB();

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return Response.json(
        { success: false, message: "User with this email or phone already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash("DearGynac@123", 10);

    const doctor = await User.create({
      name,
      email,
      phone,
      role: specialty === "radiologist" ? "radiologist" : "doctor",
      specialty,
      mrnNumber,
      experience: experience || 0,
      bio,
      passwordHash,
      isVerified: true,
      isActive: true,
      rating: 0,
    });

    return Response.json({ success: true, doctor: { _id: doctor._id, name: doctor.name } });
  } catch (error) {
    console.error("Add doctor error:", error);
    return Response.json({ success: false, message: "Failed to add doctor" }, { status: 500 });
  }
}) as any;
