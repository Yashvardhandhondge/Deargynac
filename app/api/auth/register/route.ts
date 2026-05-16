import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import {
  hashPassword,
  isValidUsername,
  normalizeUsername,
  validatePassword,
} from "@/lib/authCredentials";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = normalizeUsername(String(body.username ?? ""));
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");

    if (!isValidUsername(username)) {
      return Response.json(
        {
          success: false,
          message:
            "Username must be 3–30 characters: lowercase letters, numbers, and underscores only.",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return Response.json(
        { success: false, message: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return Response.json({ success: false, message: passwordError }, { status: 400 });
    }

    await connectDB();

    const taken = await User.findOne({ username });
    if (taken) {
      return Response.json(
        { success: false, message: "This username is already taken. Try another." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      username,
      name,
      passwordHash,
      role: "patient",
      isAnonymous: false,
      isVerified: true,
      isActive: true,
    });

    return Response.json({
      success: true,
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Register error:", error);
    return Response.json(
      { success: false, message: "Could not create account. Please try again." },
      { status: 500 }
    );
  }
}
