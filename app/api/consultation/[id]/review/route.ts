import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { resolveRefId } from "@/lib/resolveRefId";
import { Consultation } from "@/models/Consultation";

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if ((session.user as { role?: string }).role !== "patient") {
    return Response.json(
      { success: false, message: "Only patients can submit this review" },
      { status: 403 }
    );
  }

  const userId =
    (session.user as { userId?: string; id?: string }).userId ||
    (session.user as { id?: string }).id;

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.indexOf("consultation") + 1];

  let body: { stars?: unknown; comment?: unknown; anonymous?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  const stars = Number(body.stars);
  const anonymous = body.anonymous !== false;
  const comment =
    typeof body.comment === "string" ? body.comment.trim().slice(0, 500) : "";

  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return Response.json(
      { success: false, message: "Please choose a star rating from 1 to 5" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return Response.json({ success: false, message: "Not found" }, { status: 404 });
    }

    const patientRef = resolveRefId(consultation.patientId);
    if (patientRef !== userId) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (consultation.status !== "completed") {
      return Response.json(
        {
          success: false,
          message:
            "Reviews open once your doctor marks this consultation complete. You’ll find the form on this same page.",
        },
        { status: 400 }
      );
    }

    if (consultation.patientReview?.stars) {
      return Response.json(
        { success: false, message: "You have already submitted a review for this visit" },
        { status: 400 }
      );
    }

    consultation.set("patientReview", {
      stars,
      comment,
      anonymous,
      submittedAt: new Date(),
    });
    await consultation.save();

    return Response.json({
      success: true,
      patientReview: consultation.patientReview,
    });
  } catch (error) {
    console.error("Consultation review error:", error);
    return Response.json(
      { success: false, message: "Could not save review" },
      { status: 500 }
    );
  }
}) as any;
