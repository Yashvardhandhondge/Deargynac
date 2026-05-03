import { connectDB } from "@/lib/db";
import { OTP } from "@/models/OTP";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

function normalizePhone(raw: unknown): string {
  const s = raw == null ? "" : String(raw);
  return s.replace(/^\+91/, "").replace(/\s/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizePhone(body.phone);
    const otp = body.otp != null ? String(body.otp).trim() : "";

    if (!phone || !/^\d{10}$/.test(phone) || !otp) {
      return Response.json(
        { success: false, message: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const otpDoc = await OTP.findOne({ phone, verified: false }).sort({
      createdAt: -1,
    });

    if (!otpDoc) {
      return Response.json(
        { success: false, message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    if (otpDoc.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpDoc._id });
      return Response.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    if (otpDoc.attempts >= 3) {
      return Response.json(
        { success: false, message: "Too many attempts" },
        { status: 400 }
      );
    }

    await OTP.updateOne({ _id: otpDoc._id }, { $inc: { attempts: 1 } });

    const valid = await bcrypt.compare(otp, otpDoc.otpHash);

    if (!valid) {
      return Response.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    await OTP.deleteOne({ _id: otpDoc._id });

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        name: "Patient",
        role: "patient",
        isVerified: true,
        isAnonymous: false,
      });
    }

    return Response.json({
      success: true,
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    return Response.json(
      { success: false, message: "Verification failed" },
      { status: 500 }
    );
  }
}
