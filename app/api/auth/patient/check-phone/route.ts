import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

function normalizePhone(raw: unknown): string {
  const s = raw == null ? "" : String(raw);
  return s.replace(/^\+91/, "").replace(/\s/g, "");
}

/** Used for sign-in UX: unknown number → collect patient profile before OTP. */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizePhone(body.phone);

    if (!phone || !/^\d{10}$/.test(phone)) {
      return Response.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ phone }).lean();

    if (!user) {
      return Response.json({
        success: true,
        isNew: true,
      });
    }

    return Response.json({
      success: true,
      isNew: false,
    });
  } catch (error) {
    console.error("check-phone error:", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
