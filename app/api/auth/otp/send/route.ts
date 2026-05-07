import { connectDB } from "@/lib/db";
import { OTP } from "@/models/OTP";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "")
      .replace(/^\+91/, "")
      .replace(/\s/g, "");
    const intent = body.intent === "signup" ? "signup" : "signin";

    if (!phone || !/^\d{10}$/.test(phone)) {
      return Response.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ phone }).lean();
    if (intent === "signup" && existing) {
      return Response.json(
        {
          success: false,
          message:
            "An account with this number already exists. Sign in instead.",
        },
        { status: 400 }
      );
    }

    /** Dev placeholder until SMS OTP is wired — same code for every number. */
    const otp = "123456";
    const otpHash = await bcrypt.hash(otp, 10);

    // Cleanup existing OTPs for this phone
    await OTP.deleteMany({ phone });

    await OTP.create({
      phone,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
    });

    console.log(`OTP for ${phone}: ${otp} (fixed dev OTP)`);

    return Response.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP send error:", error);
    return Response.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
