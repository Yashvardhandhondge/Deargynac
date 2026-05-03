"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { t, translations, type Language, type TranslationKey } from "@/lib/translations";
import { generatePrescriptionPDF } from "@/lib/generatePrescription";

interface Message {
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface PrescriptionDoc {
  _id: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  notes?: string;
  followUpDate?: string;
  issuedAt?: string;
}

interface ConsultationData {
  _id: string;
  condition: string;
  status: string;
  type: string;
  createdAt: string;
  intakeForm?: Record<string, any>;
  doctorId?: {
    _id: string;
    name: string;
    specialty: string;
    bio: string;
    rating: number;
    mrnNumber?: string;
  };
  prescription?: PrescriptionDoc | string | null;
  messages: Message[];
}

const conditionDisplayEn: Record<string, string> = {
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

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  escalated: "bg-red-100 text-red-700",
};

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function conditionLabel(lang: Language, condition?: string): string {
  if (!condition) return "";
  if (condition in translations.en) {
    return t(lang, condition as TranslationKey);
  }
  return condition;
}

export default function ConsultationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { lang } = useLang();
  const userId = (session?.user as any)?.userId || (session?.user as any)?.id;

  const [consultation, setConsultation] = useState<ConsultationData | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [intakeOpen, setIntakeOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch consultation
  useEffect(() => {
    async function fetchConsultation() {
      try {
        const res = await fetch(`/api/consultation/${id}`);
        const json = await res.json();
        if (json.success) {
          setConsultation(json.consultation);
          setMessages(json.consultation.messages || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchConsultation();
  }, [id]);

  // Poll for new messages
  const pollMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/consultation/${id}/message`);
      const json = await res.json();
      if (json.success && json.messages) {
        setMessages(json.messages);
      }
    } catch {
      // silently fail
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(pollMessages, 10000);
    return () => clearInterval(interval);
  }, [id, pollMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    const content = newMessage.trim();

    // Optimistic update
    const optimisticMsg: Message = {
      senderId: userId,
      senderRole: "patient",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    setSending(true);

    try {
      await fetch(`/api/consultation/${id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch {
      // remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m !== optimisticMsg));
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const prescriptionObj =
    consultation?.prescription &&
    typeof consultation.prescription === "object"
      ? consultation.prescription
      : null;

  const handleDownloadPrescription = () => {
    if (!prescriptionObj || !consultation) return;
    const su = session?.user as { name?: string; alias?: string } | undefined;
    const patientName = su?.name || su?.alias || "Patient";
    generatePrescriptionPDF({
      consultationId: consultation._id,
      patientName,
      doctorName: consultation.doctorId?.name || "Doctor",
      doctorMRN: consultation.doctorId?.mrnNumber || "N/A",
      specialty:
        consultation.doctorId?.specialty?.replace(/_/g, " ") || "Gynecologist",
      condition:
        conditionDisplayEn[consultation.condition] || consultation.condition,
      medicines: (prescriptionObj.medicines || []).map((m) => ({
        name: m.name,
        dosage: m.dosage || "",
        frequency: String(m.frequency ?? "-"),
        duration: m.duration || "-",
        instructions: m.instructions || "-",
      })),
      notes: prescriptionObj.notes || "",
      followUpDate: prescriptionObj.followUpDate,
      issuedAt: prescriptionObj.issuedAt || new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#D97894] animate-spin" />
        <span className="sr-only">{t(lang, "loading")}</span>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Consultation not found.</p>
      </div>
    );
  }

  const doctor = consultation.doctorId;
  const isCompleted = consultation.status === "completed";
  const doctorInitials = doctor?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2) || "DR";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left panel */}
      <div className="lg:col-span-1 space-y-4">
        {/* Doctor info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#D97894] flex items-center justify-center text-white font-semibold">
              {doctorInitials}
            </div>
            <div>
              <h3 className="font-bold text-[#3D3438]">
                {doctor?.name || "Assigning..."}
              </h3>
              <span className="text-sm text-gray-500">
                {doctor?.specialty || "Specialist"}
              </span>
            </div>
          </div>
          <span
            className={`inline-block mt-3 text-xs px-2 py-0.5 rounded-full font-medium ${
              statusColors[consultation.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {consultation.status.charAt(0).toUpperCase() +
              consultation.status.slice(1)}
          </span>

          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Condition</span>
              <span className="font-medium text-[#3D3438]">
                {conditionLabel(lang, consultation.condition)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Started</span>
              <span className="font-medium text-[#3D3438]">
                {formatDate(consultation.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ID</span>
              <span className="text-xs text-gray-400 font-mono">
                {consultation._id.slice(-8)}
              </span>
            </div>
          </div>

          {/* Intake form toggle */}
          {consultation.intakeForm && (
            <div className="border-t border-gray-100 mt-4 pt-4">
              <button
                onClick={() => setIntakeOpen(!intakeOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-700"
              >
                View Intake Form
                {intakeOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {intakeOpen && (
                <div className="mt-3 space-y-2 text-sm">
                  {Object.entries(consultation.intakeForm).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>{" "}
                      <span className="text-[#3D3438]">
                        {Array.isArray(val) ? val.join(", ") : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status timeline */}
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    consultation.status === "active"
                      ? "bg-[#D97894] animate-pulse"
                      : consultation.status === "completed"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm text-gray-600">Doctor Reviewing</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    messages.some((m) => m.senderRole === "doctor")
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  Response Received
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCompleted ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm text-gray-600">Completed</span>
              </div>
            </div>
          </div>

          {prescriptionObj && (
            <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
              <h3 className="font-bold text-[#3D3438] text-sm mb-3">
                Prescription
              </h3>
              <ul className="space-y-2 text-sm mb-3">
                {(prescriptionObj.medicines || []).map((m, idx) => (
                  <li key={idx} className="border-l-2 border-[#D97894]/50 pl-2">
                    <span className="font-semibold text-[#3D3438]">{m.name}</span>
                    <span className="text-gray-600">
                      {" "}
                      · {m.dosage}
                      {m.frequency ? ` · ${m.frequency}` : ""}
                      {m.duration ? ` · ${m.duration}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
              {prescriptionObj.notes ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                  <span className="font-semibold text-gray-500">Notes: </span>
                  {prescriptionObj.notes}
                </p>
              ) : null}
              {prescriptionObj.followUpDate ? (
                <p className="text-xs text-amber-900 bg-amber-50 rounded-lg px-2 py-1.5 mb-3">
                  Follow-up:{" "}
                  {formatDate(prescriptionObj.followUpDate)}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handleDownloadPrescription}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#C2185B",
                  color: "white",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "0.75rem",
                }}
              >
                ⬇️ Download Prescription PDF
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Show this at any pharmacy
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel — Chat */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-[#3D3438]">
              {t(lang, "consultationChat")}
            </h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                statusColors[consultation.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {consultation.status}
            </span>
          </div>

          {/* Waiting banner */}
          {(consultation.status === "pending" ||
            consultation.status === "active") &&
            !messages.some((m) => m.senderRole === "doctor") && (
              <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-700">
                  {t(lang, "waitingForDoctor")}
                </p>
              </div>
            )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">
                No messages yet. Your doctor will respond shortly.
              </p>
            )}
            {messages.map((msg, i) => {
              const isPatient = msg.senderId === userId;
              return (
                <div
                  key={i}
                  className={`flex ${isPatient ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 text-sm ${
                      isPatient
                        ? "bg-[#D97894] text-white rounded-2xl rounded-tr-sm"
                        : "bg-white border shadow-sm rounded-2xl rounded-tl-sm text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isPatient ? "text-white/60" : "text-gray-400"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-100 p-4">
            {isCompleted ? (
              <p className="text-center text-sm text-gray-400">
                This consultation has been completed.
              </p>
            ) : (
              <div className="flex items-end gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder={t(lang, "typeMessage")}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D97894] focus:border-[#D97894] outline-none resize-none"
                />
                <button
                  type="button"
                  title={t(lang, "sendMessage")}
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="w-10 h-10 rounded-full bg-[#D97894] text-white flex items-center justify-center hover:bg-[#C45F7E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
