import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return Response.json({
      status: "ok",
      db: "connected",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  } catch {
    return Response.json(
      { status: "error", db: "disconnected", timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
