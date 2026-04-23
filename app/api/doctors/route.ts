import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const doctors = await User.find({
      role: { $in: ["doctor", "radiologist"] },
      isActive: true,
    })
      .select("name specialty bio rating experience")
      .lean();

    return Response.json(doctors);
  } catch (error) {
    console.error("Fetch doctors error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
