import { connectDB } from "@/lib/db";
import { OTP } from "@/models/OTP";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

function normalizePhone(raw: unknown): string {
  const s = raw == null ? "" : String(raw);
  return s.replace(/^\+91/, "").replace(/\s/g, "");
}

function normalizeEmail(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      const name = String(body.name ?? "").trim();
      const email = normalizeEmail(body.email);
      if (!name || name.length < 2) {
        return Response.json(
          {
            success: false,
            message: "Please enter your full name to finish creating your account.",
          },
          { status: 400 }
        );
      }
      if (!email || !isValidEmail(email)) {
        return Response.json(
          {
            success: false,
            message: "Please enter a valid email address.",
          },
          { status: 400 }
        );
      }

      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return Response.json(
          {
            success: false,
            message: "This email is already linked to another account.",
          },
          { status: 400 }
        );
      }

      try {
        user = await User.create({
          phone,
          name,
          email,
          role: "patient",
          isVerified: true,
          isAnonymous: false,
        });
      } catch (createErr: unknown) {
        const code =
          createErr && typeof createErr === "object" && "code" in createErr
            ? (createErr as { code?: number }).code
            : undefined;
        if (code === 11000) {
          return Response.json(
            {
              success: false,
              message:
                "This phone or email is already in use. Try signing in.",
            },
            { status: 400 }
          );
        }
        throw createErr;
      }
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
