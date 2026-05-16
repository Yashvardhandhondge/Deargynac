import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Consultation } from "@/models/Consultation";
import { hashPassword } from "@/lib/authCredentials";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== "deargynac_seed_2024") {
    return Response.json(
      { success: false, message: "Unauthorized. Append ?key=deargynac_seed_2024" },
      { status: 403 }
    );
  }

  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return Response.json({
        success: true,
        message: "Database already seeded. Visit /api/seed/reset first to re-seed.",
        warning: "Use /api/seed/reset to clear all data before re-seeding",
      });
    }

    const devPasswordHash = await hashPassword("DearGynac1");

    // ── Create Users ──
    const users = await User.create([
      {
        name: "Admin User",
        username: "admin",
        email: "admin@deargynac.com",
        phone: "9000000000",
        passwordHash: devPasswordHash,
        role: "admin",
        isVerified: true,
        isActive: true,
      },
      {
        name: "Dr. Snehal Pansare",
        username: "drsnehal",
        email: "snehal@deargynac.com",
        phone: "9000000001",
        passwordHash: devPasswordHash,
        role: "doctor",
        specialty: "gynecologist",
        experience: 12,
        mrnNumber: "MH-12345",
        bio: "Specialist in reproductive health, prenatal care, PCOS, and minimally invasive gynecological procedures with over 12 years of clinical experience.",
        rating: 4.9,
        isVerified: true,
        isActive: true,
      },
      {
        name: "Dr. Kshitija Kadam",
        username: "drkshitija",
        email: "kshitija@deargynac.com",
        phone: "9000000002",
        passwordHash: devPasswordHash,
        role: "radiologist",
        specialty: "radiologist",
        experience: 15,
        mrnNumber: "MH-12346",
        bio: "Expert in gynecological ultrasound, diagnostic imaging, and radiology interpretation — bridging the gap between diagnostics and clinical care.",
        rating: 4.8,
        isVerified: true,
        isActive: true,
      },
      {
        name: "Dr. Praveen Borkar",
        username: "drpraveen",
        email: "praveen@deargynac.com",
        phone: "9000000003",
        passwordHash: devPasswordHash,
        role: "doctor",
        specialty: "surgeon",
        experience: "20",
        mrnNumber: "MH-12347",
        bio: "Experienced in complex surgical interventions, laparoscopic procedures, and providing expert second opinions for surgical decisions in women\u2019s health.",
        rating: 4.9,
        isVerified: true,
        isActive: true,
      },
      {
        name: "Priya Sharma",
        username: "priya",
        phone: "9000000004",
        passwordHash: devPasswordHash,
        role: "patient",
        isVerified: true,
        isActive: true,
      },
      {
        name: "AnonymousUser1",
        alias: "AnonymousUser1",
        phone: "9000000005",
        role: "patient",
        isAnonymous: true,
        isVerified: true,
        isActive: true,
      },
    ]);

    // Map created users by role/index
    const admin = users[0];
    const doctor1 = users[1]; // Dr. Snehal
    const doctor2 = users[2]; // Dr. Kshitija
    const doctor3 = users[3]; // Dr. Praveen
    const patient1 = users[4]; // Priya
    const patient2 = users[5]; // Anonymous

    // ── Create Sample Consultations ──
    const consultation1 = await Consultation.create({
      patientId: patient1._id,
      doctorId: doctor1._id,
      condition: "pcos",
      status: "active",
      type: "async",
      amount: 149,
      pricingRule: "standard",
      paymentStatus: "paid",
      intakeForm: {
        duration: "3-12 months",
        symptoms: ["Irregular periods", "Weight gain", "Acne"],
        diagnosed: "No",
        medications: "None",
      },
      messages: [
        {
          senderId: patient1._id,
          senderRole: "patient",
          content:
            "Hi Doctor, I have been experiencing irregular periods and weight gain for the past 6 months. I also have acne breakouts that won't go away. I am very worried. Could this be PCOS?",
          createdAt: new Date(Date.now() - 20 * 60 * 1000),
        },
      ],
      responseDeadline: new Date(Date.now() + 5 * 60 * 1000),
    });

    const consultation2 = await Consultation.create({
      patientId: patient2._id,
      doctorId: doctor1._id,
      condition: "periods",
      status: "pending",
      type: "async",
      amount: 149,
      pricingRule: "standard",
      paymentStatus: "paid",
      intakeForm: {
        pattern: "Painful",
        days: 7,
        severity: 8,
        symptoms: ["Nausea", "Bloating"],
      },
      messages: [],
      responseDeadline: new Date(Date.now() - 5 * 60 * 1000), // already breached for SLA demo
    });

    // ── Log Testing Guide ──
    console.log("\n");
    console.log("=== DEARGYNAC SEED COMPLETE ===");
    console.log("Test password for registered accounts: DearGynac1");
    console.log("Usernames: admin, drsnehal, drkshitija, drpraveen, priya");
    console.log(`Consultation 1 (PCOS/active):     ${consultation1._id}`);
    console.log(`Consultation 2 (Periods/breached): ${consultation2._id}`);
    console.log("===============================\n");

    return Response.json({
      success: true,
      message: "Database seeded successfully",
      created: { admins: 1, doctors: 3, patients: 2, consultations: 2 },
      testCredentials: {
        note: "Registered accounts: password DearGynac1. Anonymous seed user has no login.",
        accounts: [
          { role: "admin", name: "Admin User", username: "admin", password: "DearGynac1", url: "/admin" },
          { role: "doctor", name: "Dr. Snehal Pansare", username: "drsnehal", password: "DearGynac1", url: "/doctor" },
          { role: "doctor", name: "Dr. Kshitija Borkar", username: "drkshitija", password: "DearGynac1", url: "/doctor" },
          { role: "doctor", name: "Dr. Praveen Borkar", username: "drpraveen", password: "DearGynac1", url: "/doctor" },
          { role: "patient", name: "Priya Sharma", username: "priya", password: "DearGynac1", url: "/patient" },
        ],
      },
      consultations: [
        { id: consultation1._id, condition: "PCOS", status: "active" },
        { id: consultation2._id, condition: "Periods", status: "pending (SLA breached)" },
      ],
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return Response.json(
      { success: false, message: "Seed failed", error: error.message },
      { status: 500 }
    );
  }
}
