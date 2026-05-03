"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FolderOpen, FileText, Pill } from "lucide-react";
import { generatePrescriptionPDF } from "@/lib/generatePrescription";

type PopulatedDoctor = {
  name?: string;
  specialty?: string;
  mrnNumber?: string;
};

type PopulatedConsultation = {
  condition?: string;
  status?: string;
  createdAt?: string;
};

type MedicineRow = {
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
};

type PatientPrescription = {
  _id: string;
  issuedAt: string;
  notes?: string;
  followUpDate?: string;
  medicines: MedicineRow[];
  doctorId?: PopulatedDoctor | string;
  consultationId?: PopulatedConsultation | string;
};

const conditionLabels: Record<string, string> = {
  pcos: "PCOS / Hormones",
  periods: "Period Problems",
  uti: "UTI / Infections",
  discharge: "Unusual Discharge",
  pain: "Pelvic Pain",
  pregnancy: "Pregnancy Care",
  diagnostics: "Diagnostics Review",
  fertility: "Fertility & Conception",
  hormone: "Hormone & Cycle Health",
  ayurvedic: "Ayurvedic / Integrative",
  mental: "Mental & Sexual Wellness",
  other: "Other Concern",
};

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function RecordsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"prescriptions" | "reports">("prescriptions");
  const [prescriptions, setPrescriptions] = useState<PatientPrescription[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownloadPrescription = (rx: PatientPrescription) => {
    const doc =
      rx.doctorId && typeof rx.doctorId === "object" ? rx.doctorId : null;
    const consult =
      rx.consultationId && typeof rx.consultationId === "object"
        ? rx.consultationId
        : null;
    const cid =
      rx.consultationId &&
      typeof rx.consultationId === "object" &&
      "_id" in rx.consultationId
        ? String((rx.consultationId as { _id: string })._id)
        : typeof rx.consultationId === "string"
          ? rx.consultationId
          : rx._id;
    const su = session?.user as { name?: string; alias?: string } | undefined;
    const patientName = su?.name || su?.alias || "Patient";
    const condKey = consult?.condition || "";
    generatePrescriptionPDF({
      consultationId: cid,
      patientName,
      doctorName: doc?.name || "Doctor",
      doctorMRN: doc?.mrnNumber || "N/A",
      specialty:
        doc?.specialty?.replace(/_/g, " ") || "Gynecologist",
      condition: conditionLabels[condKey] || condKey || "Consultation",
      medicines: (rx.medicines || []).map((m) => ({
        name: m.name,
        dosage: m.dosage || "",
        frequency: String(m.frequency ?? "-"),
        duration: m.duration || "-",
        instructions: m.instructions || "-",
      })),
      notes: rx.notes || "",
      followUpDate: rx.followUpDate,
      issuedAt: rx.issuedAt || new Date().toISOString(),
    });
  };

  useEffect(() => {
    fetch("/api/patient/prescriptions")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.prescriptions)) {
          setPrescriptions(d.prescriptions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#3D3438",
          fontFamily: '"Playfair Display", Georgia, serif',
          marginBottom: "1.5rem",
        }}
      >
        My Health Records
      </h2>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab("prescriptions")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === "prescriptions"
              ? "bg-[#D97894] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Prescriptions
        </button>
        <button
          type="button"
          onClick={() => setTab("reports")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === "reports"
              ? "bg-[#D97894] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Reports
        </button>
      </div>

      {tab === "prescriptions" ? (
        loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-48 bg-gray-50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">
              No prescriptions yet
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Complete a consultation to receive your first prescription.
            </p>
          </div>
        ) : (
          <ul className="space-y-5">
            {prescriptions.map((rx) => {
              const doc =
                rx.doctorId && typeof rx.doctorId === "object"
                  ? rx.doctorId
                  : null;
              const consult =
                rx.consultationId && typeof rx.consultationId === "object"
                  ? rx.consultationId
                  : null;
              const conditionKey = consult?.condition || "";
              const conditionLabel =
                conditionLabels[conditionKey] || conditionKey || "Consultation";

              return (
                <li
                  key={rx._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-gray-50 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                        Issued {formatDate(rx.issuedAt)}
                      </p>
                      <p className="font-semibold text-[#3D3438] mt-1">
                        {doc?.name ? (
                          <>
                            {doc.name.startsWith("Dr.") ? "" : "Dr. "}
                            {doc.name}
                          </>
                        ) : (
                          "Your doctor"
                        )}
                      </p>
                      {doc?.specialty && (
                        <p className="text-sm text-gray-500 capitalize">
                          {doc.specialty.replace("_", " ")}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-rose-50 text-[#D97894] text-xs font-medium px-3 py-1">
                      {conditionLabel}
                    </span>
                  </div>

                  <div className="px-5 py-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5" />
                      Medicines
                    </p>
                    <ul className="space-y-3">
                      {rx.medicines.map((m, idx) => (
                        <li
                          key={`${rx._id}-m-${idx}`}
                          className="text-sm border-l-2 border-[#D97894]/40 pl-3"
                        >
                          <span className="font-medium text-[#3D3438]">
                            {m.name}
                          </span>
                          <span className="text-gray-600">
                            {" "}
                            · {m.dosage}
                            {m.frequency ? ` · ${m.frequency}` : ""}
                            {m.duration ? ` · ${m.duration}` : ""}
                          </span>
                          {m.instructions ? (
                            <p className="text-gray-500 mt-0.5">
                              {m.instructions}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>

                    {rx.notes ? (
                      <div className="pt-2 border-t border-gray-50">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Doctor&apos;s notes
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {rx.notes}
                        </p>
                      </div>
                    ) : null}

                    {rx.followUpDate ? (
                      <p className="text-sm text-amber-800 bg-amber-50 rounded-lg px-3 py-2">
                        <span className="font-medium">Follow-up: </span>
                        {formatDate(rx.followUpDate)}
                      </p>
                    ) : null}

                    {doc?.mrnNumber ? (
                      <p className="text-xs text-gray-400">
                        Doctor MRN: {doc.mrnNumber}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleDownloadPrescription(rx)}
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-full bg-[#C2185B] text-white py-2.5 text-sm font-semibold hover:bg-[#a91551] transition-colors"
                    >
                      ⬇️ Download PDF
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )
      ) : (
        <div className="text-center py-20">
          <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">No reports yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Diagnostic reports will appear here after your consultation.
          </p>
        </div>
      )}
    </div>
  );
}
