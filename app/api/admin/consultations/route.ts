import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";
import { User } from "@/models/User";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user || (session.user as any).role !== "admin") {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const condition = url.searchParams.get("condition");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search");

    const filter: any = {};
    if (status && status !== "all") filter.status = status;
    if (condition && condition !== "all") filter.condition = condition;

    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { alias: { $regex: search, $options: "i" } },
        ],
      }).select("_id").lean();
      filter.patientId = { $in: users.map((u: any) => u._id) };
    }

    const [consultations, total] = await Promise.all([
      Consultation.find(filter)
        .populate("patientId", "name alias isAnonymous")
        .populate("doctorId", "name specialty")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Consultation.countDocuments(filter),
    ]);

    return Response.json({
      success: true,
      consultations,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', 'Pragma': 'no-cache' },
    });
  } catch (error) {
    console.error("Admin consultations error:", error);
    return Response.json({ success: false, message: "Failed" }, { status: 500 });
  }
}) as any;
