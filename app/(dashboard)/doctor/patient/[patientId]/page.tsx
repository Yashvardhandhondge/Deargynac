"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  Pill,
  Calendar,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

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

const statusDot: Record<string, string> = {
  active: "bg-rose-500",
  pending: "bg-amber-500",
  completed: "bg-green-500",
  escalated: "bg-red-500",
  cancelled: "bg-gray-400",
};

const statusBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  escalated: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

interface Medicine {
  name: string;
  dosage: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

interface PrescriptionPop {
  _id?: string;
  medicines?: Medicine[];
  notes?: string;
  followUpDate?: string;
  issuedAt?: string;
}

interface ConsultationRow {
  _id: string;
  condition?: string;
  status: string;
  createdAt: string;
  doctorId?: { name?: string; specialty?: string };
  prescription?: PrescriptionPop | null;
}

interface PatientDoc {
  name?: string;
  alias?: string;
  isAnonymous?: boolean;
  createdAt?: string;
}

function formatDt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DoctorPatientHistoryPage() {
  const params = useParams<{ patientId: string }>();
  const router = useRouter();
  const patientId = params.patientId;

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientDoc | null>(null);
  const [consultations, setConsultations] = useState<ConsultationRow[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [prescriptionCount, setPrescriptionCount] = useState(0);
  const [tab, setTab] = useState<"timeline" | "prescriptions">("timeline");
  const [expandedRx, setExpandedRx] = useState<string | null>(null);
  const [expandedTimelineRx, setExpandedTimelineRx] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetch(`/api/doctor/patient/${patientId}/history`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPatient(d.patient || null);
          setConsultations(d.consultations || []);
          setConditions(d.conditions || []);
          setPrescriptionCount(d.prescriptionCount ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [patientId]);

  const displayName = useMemo(() => {
    if (!patient) return "Patient";
    if (patient.isAnonymous && patient.alias) return patient.alias;
    return patient.name || "Patient";
  }, [patient]);

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = patient?.createdAt
    ? formatDay(patient.createdAt)
    : "—";

  const lastVisit =
    consultations.length > 0 ? formatDay(consultations[0].createdAt) : "—";

  const rxRows = useMemo(() => {
    return consultations
      .filter((c) => !!c.prescription)
      .map((c) => ({
        consultationId: c._id,
        condition: c.condition,
        createdAt: c.createdAt,
        doctorName: c.doctorId?.name || "Doctor",
        prescription: c.prescription as PrescriptionPop,
      }));
  }, [consultations]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-10 h-10 text-[#D97894] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#D97894]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white rounded-2xl border border-gray-100 p-6">
        <div className="w-20 h-20 rounded-full bg-rose-100 text-[#C2185B] flex items-center justify-center text-2xl font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-[#3D3438] font-serif truncate">
              {displayName}
            </h1>
            {patient?.isAnonymous && (
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                Anonymous Patient
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Member since {memberSince}
          </p>
          <span className="inline-flex mt-3 text-xs font-bold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
            {consultations.length} consultation
            {consultations.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
            <ClipboardList className="w-4 h-4" />
            Total consultations
          </div>
          <p className="text-2xl font-bold text-[#3D3438] mt-2">
            {consultations.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
            <Stethoscope className="w-4 h-4" />
            Conditions treated
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {conditions.length === 0 ? (
              <span className="text-sm text-gray-400">—</span>
            ) : (
              conditions.map((c) => (
                <span
                  key={c}
                  className="text-xs font-medium bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full"
                >
                  {conditionLabels[c] || c}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
            <Calendar className="w-4 h-4" />
            Last visit
          </div>
          <p className="text-lg font-semibold text-[#3D3438] mt-2">
            {lastVisit}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wide">
            <Pill className="w-4 h-4" />
            Prescriptions issued
          </div>
          <p className="text-2xl font-bold text-[#3D3438] mt-2">
            {prescriptionCount}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-1">
        <button
          type="button"
          onClick={() => setTab("timeline")}
          className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
            tab === "timeline"
              ? "bg-white text-[#C2185B] border border-b-0 border-gray-200 -mb-px"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Timeline
        </button>
        <button
          type="button"
          onClick={() => setTab("prescriptions")}
          className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
            tab === "prescriptions"
              ? "bg-white text-[#C2185B] border border-b-0 border-gray-200 -mb-px"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Prescriptions ({rxRows.length})
        </button>
      </div>

      {tab === "timeline" && (
        <div className="relative pl-6 border-l-2 border-rose-100 space-y-8 ml-3">
          {consultations.length === 0 ? (
            <p className="text-gray-500 text-sm">No consultations found.</p>
          ) : (
            consultations.map((c) => {
              const dot =
                statusDot[c.status] || "bg-gray-400";
              const hasRx = !!c.prescription;
              const open = expandedTimelineRx === c._id;
              return (
                <div key={c._id} className="relative">
                  <div
                    className={`absolute -left-[1.6rem] top-1.5 w-3 h-3 rounded-full border-2 border-white ${dot}`}
                  />
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#3D3438]">
                          {formatDt(c.createdAt)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 font-medium">
                            {conditionLabels[c.condition || ""] ||
                              c.condition ||
                              "—"}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                              statusBadge[c.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Doctor:{" "}
                          <span className="font-medium text-[#3D3438]">
                            {c.doctorId?.name || "—"}
                          </span>
                        </p>
                      </div>
                      <Link
                        href={`/doctor/consultation/${c._id}`}
                        className="text-sm font-semibold text-[#C2185B] hover:underline shrink-0"
                      >
                        View full consultation →
                      </Link>
                    </div>

                    {hasRx && (
                      <div className="mt-3 border-t border-gray-50 pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTimelineRx(open ? null : c._id)
                          }
                          className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                        >
                          {open ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          Prescription ({c.prescription?.medicines?.length ?? 0}{" "}
                          medicines)
                        </button>
                        {open && c.prescription?.medicines && (
                          <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            {c.prescription.medicines.map((m, i) => (
                              <li key={i}>
                                <span className="font-medium">{m.name}</span>
                                <span className="text-gray-500">
                                  {" "}
                                  · {m.dosage}
                                  {m.frequency ? ` · ${m.frequency}` : ""}
                                  {m.duration ? ` · ${m.duration}` : ""}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "prescriptions" && (
        <div className="space-y-4">
          {rxRows.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No prescriptions issued for this patient yet.
            </p>
          ) : (
            rxRows.map((row) => {
              const open = expandedRx === row.consultationId;
              const meds = row.prescription.medicines || [];
              return (
                <div
                  key={row.consultationId}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedRx(open ? null : row.consultationId)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-semibold text-[#3D3438]">
                        {formatDay(row.createdAt)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {row.doctorName} ·{" "}
                        {conditionLabels[row.condition || ""] ||
                          row.condition ||
                          "—"}{" "}
                        · {meds.length} medicine{meds.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#C2185B] flex items-center gap-1">
                      View details
                      {open ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-3">
                      <ul className="space-y-2 text-sm">
                        {meds.map((m, i) => (
                          <li
                            key={i}
                            className="border-l-2 border-rose-200 pl-3"
                          >
                            <span className="font-medium">{m.name}</span>
                            <span className="text-gray-600">
                              {" "}
                              · {m.dosage}
                              {m.frequency ? ` · ${m.frequency}` : ""}
                              {m.duration ? ` · ${m.duration}` : ""}
                            </span>
                            {m.instructions ? (
                              <p className="text-gray-500 text-xs mt-0.5">
                                {m.instructions}
                              </p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                      {row.prescription.notes ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          <span className="font-semibold">Notes: </span>
                          {row.prescription.notes}
                        </p>
                      ) : null}
                      <Link
                        href={`/doctor/consultation/${row.consultationId}`}
                        className="inline-block text-sm font-semibold text-[#C2185B]"
                      >
                        Open consultation →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
