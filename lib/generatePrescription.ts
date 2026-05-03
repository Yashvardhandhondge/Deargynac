"use client";

import jsPDF from "jspdf";

export interface PrescriptionData {
  consultationId: string;
  patientName: string;
  doctorName: string;
  doctorMRN: string;
  specialty: string;
  condition: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  notes: string;
  followUpDate?: string;
  issuedAt: string;
}

export function generatePrescriptionPDF(data: PrescriptionData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  doc.setFillColor(194, 24, 91);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("DearGynac", margin, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Your Health. Your Privacy. Our Promise.", margin, 26);

  doc.setFontSize(8);
  doc.text("NMC Compliant | DPDP 2023", pageWidth - margin - 40, 18);
  doc.text("www.deargynac.com", pageWidth - margin - 30, 26);

  y = 50;

  doc.setTextColor(26, 10, 18);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("MEDICAL PRESCRIPTION", margin, y);

  doc.setDrawColor(194, 24, 91);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 3, pageWidth - margin, y + 3);

  y += 15;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(194, 24, 91);
  doc.text("DOCTOR INFORMATION", margin, y);
  doc.text("PATIENT INFORMATION", pageWidth / 2 + 5, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 10, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(data.doctorName, margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(data.specialty, margin, y + 5);
  doc.text("MRN: " + data.doctorMRN, margin, y + 10);
  doc.text("Platform: DearGynac", margin, y + 15);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(data.patientName, pageWidth / 2 + 5, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "Condition: " + data.condition.toUpperCase(),
    pageWidth / 2 + 5,
    y + 5
  );
  doc.text(
    "Consultation ID: " + data.consultationId.slice(-8).toUpperCase(),
    pageWidth / 2 + 5,
    y + 10
  );
  doc.text(
    "Date: " +
      new Date(data.issuedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    pageWidth / 2 + 5,
    y + 15
  );

  y += 28;

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 10, 18);
  doc.text("Rx  PRESCRIBED MEDICINES", margin, y);

  y += 8;

  doc.setFillColor(253, 232, 240);
  doc.rect(margin, y - 5, pageWidth - margin * 2, 8, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(194, 24, 91);
  doc.text("#", margin + 2, y);
  doc.text("Medicine", margin + 10, y);
  doc.text("Dosage", margin + 65, y);
  doc.text("Frequency", margin + 95, y);
  doc.text("Duration", margin + 130, y);
  doc.text("Instructions", margin + 155, y);

  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(26, 10, 18);

  const meds = data.medicines?.length
    ? data.medicines
    : [
        {
          name: "—",
          dosage: "—",
          frequency: "—",
          duration: "—",
          instructions: "—",
        },
      ];

  meds.forEach((med, index) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    const rowBg = index % 2 === 0 ? [255, 255, 255] : [254, 252, 250];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 9, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(String(index + 1), margin + 2, y);
    doc.setFont("helvetica", "normal");

    const medName =
      med.name.length > 25 ? med.name.substring(0, 25) + "..." : med.name;
    doc.text(medName, margin + 10, y);
    doc.text(med.dosage || "-", margin + 65, y);
    doc.text(String(med.frequency || "-"), margin + 95, y);
    doc.text(med.duration || "-", margin + 130, y);

    const instr = med.instructions || "-";
    const instructions =
      instr.length > 20 ? instr.substring(0, 20) + "..." : instr;
    doc.text(instructions, margin + 155, y);

    y += 9;
  });

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  if (data.notes) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 10, 18);
    doc.text("Doctor's Notes & Instructions:", margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);

    const splitNotes = doc.splitTextToSize(
      data.notes,
      pageWidth - margin * 2
    );
    doc.text(splitNotes, margin, y);
    y += splitNotes.length * 5 + 5;
  }

  if (data.followUpDate) {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(253, 243, 220);
    doc.rect(margin, y - 3, pageWidth - margin * 2, 12, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(166, 124, 0);
    doc.text(
      "Follow-up Date: " +
        new Date(data.followUpDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      margin + 3,
      y + 5
    );
    y += 18;
  }

  const footerY = doc.internal.pageSize.getHeight() - 30;

  doc.setDrawColor(194, 24, 91);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Doctor's Signature:", margin, footerY + 8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 10, 18);
  doc.text(data.doctorName, margin, footerY + 15);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("MRN: " + data.doctorMRN, margin, footerY + 20);

  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  const disclaimer =
    "This prescription is issued via DearGynac telemedicine platform under NMC Telemedicine Guidelines 2020.";
  const splitDisclaimer = doc.splitTextToSize(disclaimer, 90);
  doc.text(splitDisclaimer, pageWidth - margin - 90, footerY + 8);

  const shortId = data.consultationId.slice(-8).toUpperCase();
  const filename = `DearGynac_Prescription_${shortId}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(filename);
}
