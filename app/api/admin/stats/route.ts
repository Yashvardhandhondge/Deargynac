import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Consultation } from "@/models/Consultation";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalUsers, totalConsultations, activeNow, slaBreachesToday] =
      await Promise.all([
        User.countDocuments(),
        Consultation.countDocuments(),
        Consultation.countDocuments({ status: { $in: ["pending", "active"] } }),
        Consultation.countDocuments({
          status: { $in: ["pending", "active"] },
          responseDeadline: { $lt: new Date() },
        }),
      ]);

    return Response.json({
      success: true,
      totalUsers,
      totalConsultations,
      activeNow,
      slaBreachesToday,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json({ success: false, message: "Failed" }, { status: 500 });
  }
}) as any;
