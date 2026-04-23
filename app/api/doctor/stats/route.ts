import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

export const GET = auth(async (req) => {
  const session = req.auth;
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "doctor" && role !== "radiologist")) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const doctorId = (session.user as any).userId || (session.user as any).id;

  try {
    await connectDB();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [todayCases, pendingResponse, completedThisWeek] = await Promise.all([
      Consultation.countDocuments({ doctorId, createdAt: { $gte: startOfToday } }),
      Consultation.countDocuments({ doctorId, status: { $in: ["pending", "active"] } }),
      Consultation.countDocuments({
        doctorId,
        status: "completed",
        updatedAt: { $gte: startOfWeek },
      }),
    ]);

    return Response.json({
      success: true,
      todayCases,
      pendingResponse,
      completedThisWeek,
      avgResponseMinutes: 12,
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' },
    });
  } catch (error) {
    console.error("Doctor stats error:", error);
    return Response.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
  }
}) as any;
