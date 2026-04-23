import { connectDB } from "@/lib/db";
import { OTP } from "@/models/OTP";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { phone: rawPhone } = await req.json();
    const phone = rawPhone?.replace(/^\+91/, "").replace(/\s/g, "");

    if (!phone || !/^\d{10}$/.test(phone)) {
      return Response.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    await connectDB();

    const SEEDED_TEST_PHONES = [
      '9000000000', '9000000001', '9000000002',
      '9000000003', '9000000004', '9000000005',
    ];
    const isTestPhone = SEEDED_TEST_PHONES.includes(phone);
    const otp = isTestPhone ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Cleanup existing OTPs for this phone
    await OTP.deleteMany({ phone });

    await OTP.create({
      phone,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
    });

    console.log(`OTP for ${phone}: ${otp}${isTestPhone ? ' (TEST ACCOUNT - fixed OTP)' : ''}`);

    return Response.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP send error:", error);
    return Response.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
