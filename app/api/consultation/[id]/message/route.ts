import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Consultation } from "@/models/Consultation";

export const GET = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = (session.user as any).userId || (session.user as any).id;
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.indexOf("consultation") + 1];

  try {
    await connectDB();

    const consultation = await Consultation.findById(id)
      .select("messages patientId doctorId")
      .lean();

    if (!consultation) {
      return Response.json(
        { success: false, message: "Consultation not found" },
        { status: 404 }
      );
    }

    const c = consultation as any;
    if (
      c.patientId.toString() !== userId &&
      c.doctorId?.toString() !== userId
    ) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    return Response.json({ success: true, messages: c.messages || [] });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}) as any;

export const POST = auth(async (req) => {
  const session = req.auth;
  if (!session?.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = (session.user as any).userId || (session.user as any).id;
  const role = (session.user as any).role;
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.indexOf("consultation") + 1];

  try {
    const { content } = await req.json();

    if (!content?.trim()) {
      return Response.json(
        { success: false, message: "Message content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const consultation = await Consultation.findById(id)
      .select("patientId doctorId status")
      .lean();

    if (!consultation) {
      return Response.json(
        { success: false, message: "Consultation not found" },
        { status: 404 }
      );
    }

    const c = consultation as any;
    if (
      c.patientId.toString() !== userId &&
      c.doctorId?.toString() !== userId
    ) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const message = {
      senderId: userId,
      senderRole: role,
      content: content.trim(),
      createdAt: new Date(),
    };

    await Consultation.updateOne(
      { _id: id },
      { $push: { messages: message } }
    );

    return Response.json({ success: true, message });
  } catch (error) {
    console.error("Send message error:", error);
    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}) as any;
