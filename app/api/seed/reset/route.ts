import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Consultation } from "@/models/Consultation";
import { Prescription } from "@/models/Prescription";
import { Appointment } from "@/models/Appointment";
import mongoose from "mongoose";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { success: false, message: "Reset endpoint is disabled in production" },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    // Delete OTPs via raw collection (model may not be imported everywhere)
    const otpCollection = mongoose.connection.collection("otps");
    const otpResult = await otpCollection.deleteMany({}).catch(() => ({ deletedCount: 0 }));

    const userResult = await User.deleteMany({});
    const consultationResult = await Consultation.deleteMany({});
    const prescriptionResult = await Prescription.deleteMany({});
    const appointmentResult = await Appointment.deleteMany({});

    console.log("\n");
    console.log("╔══════════════════════════════════════════════╗");
    console.log("║        🗑️  DATABASE RESET COMPLETE 🗑️        ║");
    console.log("╠══════════════════════════════════════════════╣");
    console.log(`║  Users deleted:         ${userResult.deletedCount}`.padEnd(49) + "║");
    console.log(`║  Consultations deleted: ${consultationResult.deletedCount}`.padEnd(49) + "║");
    console.log(`║  Prescriptions deleted: ${prescriptionResult.deletedCount}`.padEnd(49) + "║");
    console.log(`║  Appointments deleted:  ${appointmentResult.deletedCount}`.padEnd(49) + "║");
    console.log(`║  OTPs deleted:          ${otpResult.deletedCount}`.padEnd(49) + "║");
    console.log("║                                              ║");
    console.log("║  Now visit /api/seed to re-seed              ║");
    console.log("╚══════════════════════════════════════════════╝");
    console.log("\n");

    return Response.json({
      success: true,
      message: "Database cleared successfully",
      deleted: {
        users: userResult.deletedCount,
        consultations: consultationResult.deletedCount,
        prescriptions: prescriptionResult.deletedCount,
        appointments: appointmentResult.deletedCount,
        otps: otpResult.deletedCount,
      },
      next: "Visit /api/seed to re-seed the database",
    });
  } catch (error: any) {
    console.error("Reset error:", error);
    return Response.json(
      { success: false, message: "Reset failed", error: error.message },
      { status: 500 }
    );
  }
}
