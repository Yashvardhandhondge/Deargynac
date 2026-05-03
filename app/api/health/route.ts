import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
    return Response.json({
      status: "ok",
      db: "connected",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      hasSecret: !!secret,
      secretLength: secret?.length ?? 0,
      nextAuthUrl:
        process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? null,
      nodeEnv: process.env.NODE_ENV,
    });
  } catch {
    return Response.json(
      { status: "error", db: "disconnected", timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
