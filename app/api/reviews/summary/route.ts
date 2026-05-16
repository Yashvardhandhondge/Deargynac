import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

export const dynamic = "force-dynamic";

export type PublicReviewSample = {
  stars: number;
  comment: string | null;
  anonymous: boolean;
  submittedAt: string | null;
};

export async function GET() {
  try {
    await connectDB();

    const match = {
      status: "completed" as const,
      "patientReview.stars": { $gte: 1, $lte: 5 },
    };

    const agg = await Consultation.aggregate<{
      count: number;
      avgStars: number | null;
    }>([
      { $match: match },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          avgStars: { $avg: "$patientReview.stars" },
        },
      },
    ]);

    const count = agg[0]?.count ?? 0;
    const averageStars =
      agg[0]?.avgStars != null ? Math.round(agg[0].avgStars * 10) / 10 : null;

    const raw = await Consultation.find(match)
      .sort({ "patientReview.submittedAt": -1 })
      .limit(12)
      .select("patientReview")
      .lean();

    const samples: PublicReviewSample[] = (raw as { patientReview?: Record<string, unknown> }[]).map(
      (doc) => {
        const pr = doc.patientReview;
        if (!pr || typeof pr.stars !== "number") {
          return {
            stars: 0,
            comment: null,
            anonymous: true,
            submittedAt: null,
          };
        }
        const c = typeof pr.comment === "string" ? pr.comment.trim() : "";
        return {
          stars: pr.stars,
          comment: c.length > 0 ? c : null,
          anonymous: pr.anonymous !== false,
          submittedAt:
            pr.submittedAt instanceof Date
              ? pr.submittedAt.toISOString()
              : typeof pr.submittedAt === "string"
                ? pr.submittedAt
                : null,
        };
      }
    ).filter((s) => s.stars >= 1 && s.stars <= 5);

    return Response.json({
      success: true,
      count,
      averageStars,
      samples,
    });
  } catch (error) {
    console.error("Reviews summary error:", error);
    return Response.json(
      { success: false, message: "Failed to load reviews" },
      { status: 500 }
    );
  }
}
