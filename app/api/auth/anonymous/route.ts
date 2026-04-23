import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST() {
  try {
    await connectDB();

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const alias = `Anonymous${suffix}`;

    const user = await User.create({
      alias,
      name: alias,
      role: "patient",
      isAnonymous: true,
      isVerified: true,
    });

    return Response.json({
      success: true,
      userId: user._id.toString(),
      role: "patient",
      alias,
      isAnonymous: true,
    });
  } catch (error) {
    console.error("Anonymous signup error:", error);
    return Response.json(
      { success: false, message: "Failed to create anonymous profile" },
      { status: 500 }
    );
  }
}
