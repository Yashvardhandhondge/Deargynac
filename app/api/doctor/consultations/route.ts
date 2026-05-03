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

    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status") || "active,pending";

    const filter: Record<string, unknown> = { doctorId };

    if (statusParam !== "all") {
      const statuses = statusParam.split(",").map((s) => s.trim()).filter(Boolean);
      filter.status = { $in: statuses };
    }

    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
    const limitRaw = url.searchParams.get("limit");
    const limit =
      limitRaw != null && limitRaw !== ""
        ? Math.min(100, Math.max(1, parseInt(limitRaw, 10) || 10))
        : null;

    const baseQuery = Consultation.find(filter)
      .populate("patientId", "name alias isAnonymous phone")
      .sort({ createdAt: -1 });

    let consultations;
    let total: number;

    if (limit != null) {
      total = await Consultation.countDocuments(filter);
      consultations = await baseQuery
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    } else {
      consultations = await baseQuery.lean();
      total = consultations.length;
    }

    const totalPages = limit != null ? Math.max(1, Math.ceil(total / limit)) : 1;

    return Response.json(
      {
        success: true,
        consultations,
        total,
        page: limit != null ? page : 1,
        totalPages,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Doctor consultations error:", error);
    return Response.json({ success: false, message: "Failed to fetch" }, { status: 500 });
  }
}) as any;
