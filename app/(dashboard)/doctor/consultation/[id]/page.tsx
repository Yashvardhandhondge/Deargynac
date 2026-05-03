"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react";

interface Message {
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
}

interface ConsultationData {
  _id: string;
  condition: string;
  status: string;
  type: string;
  createdAt: string;
  responseDeadline?: string;
  intakeForm?: Record<string, any>;
  patientId?: any;
  doctorId?: {
    _id: string;
    name: string;
    specialty: string;
    bio: string;
    rating: number;
  };
  prescription?: any;
  messages: Message[];
}

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

const conditionColors: Record<string, string> = {
  pcos: "bg-rose-100 text-rose-700",
  periods: "bg-purple-100 text-purple-700",
  uti: "bg-red-100 text-red-700",
  discharge: "bg-blue-100 text-blue-700",
  pain: "bg-red-100 text-red-800",
  pregnancy: "bg-pink-100 text-pink-700",
  diagnostics: "bg-amber-100 text-amber-800",
  fertility: "bg-cyan-100 text-cyan-800",
  hormone: "bg-violet-100 text-violet-800",
  ayurvedic: "bg-emerald-100 text-emerald-800",
  mental: "bg-fuchsia-100 text-fuchsia-800",
  other: "bg-gray-100 text-gray-700",
};

const quickReplies = [
  "Please describe when the symptoms started",
  "Have you taken any medication recently?",
  "I recommend you get a blood test done",
];

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function DoctorConsultationPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const userId = (session?.user as any)?.userId || (session?.user as any)?.id;
  const doctorName = (session?.user as any)?.name || "Doctor";

  const [consultation, setConsultation] = useState<ConsultationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [slaRemaining, setSlaRemaining] = useState("");
  const [slaBreach, setSlaBreach] = useState(false);
  const [intakeOpen, setIntakeOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch consultation
  useEffect(() => {
    if (!id) return;
    fetch(`/api/consultation/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setConsultation(json.consultation);
          setMessages(json.consultation.messages || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // SLA countdown
  useEffect(() => {
    if (!consultation?.responseDeadline) return;
    const tick = () => {
      const diff = new Date(consultation.responseDeadline!).getTime() - Date.now();
      if (diff <= 0) {
        setSlaBreach(true);
        const elapsed = Math.abs(diff);
        setSlaRemaining(`Breached ${Math.floor(elapsed / 60000)}m ago`);
      } else {
        setSlaBreach(false);
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setSlaRemaining(`${mins}:${secs.toString().padStart(2, "0")} remaining`);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [consultation?.responseDeadline]);

  // Poll messages
  const pollMessages = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/consultation/${id}/message`);
      const json = await res.json();
      if (json.success) setMessages(json.messages);
    } catch {}
  }, [id]);

  useEffect(() => {
    const interval = setInterval(pollMessages, 10000);
    return () => clearInterval(interval);
  }, [pollMessages]);

  useEffect(() => scrollToBottom(), [messages]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    const content = newMessage.trim();
    const optimistic: Message = {
      senderId: userId,
      senderRole: "doctor",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setNewMessage("");
    setSending(true);
    try {
      await fetch(`/api/consultation/${id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    } catch {
      setMessages((prev) => prev.filter((m) => m !== optimistic));
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMarkComplete = async () => {
    try {
      const res = await fetch(`/api/consultation/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Consultation marked as completed");
        setConsultation((prev) => prev ? { ...prev, status: "completed" } : prev);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleEscalate = async () => {
    if (!confirm("Are you sure you want to escalate this case?")) return;
    try {
      const res = await fetch(`/api/consultation/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "escalated" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Case escalated");
        setConsultation((prev) => prev ? { ...prev, status: "escalated" } : prev);
      }
    } catch {
      toast.error("Failed to escalate");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }
  if (!consultation) {
    return <div className="text-center py-20 text-gray-500">Consultation not found.</div>;
  }

  const patient = consultation.patientId;
  const patientName = patient?.isAnonymous
    ? patient.alias || "Anonymous"
    : patient?.name || "Patient";
  const patientInitial = patientName.charAt(0).toUpperCase();
  const isCompleted = consultation.status === "completed" || consultation.status === "escalated";

  return (
    <div className="grid lg:grid-cols-12 gap-4">
      {/* LEFT: Patient info */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-6 space-y-4">
          {/* Patient */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-sm">
              {patientInitial}
            </div>
            <div>
              <p className="font-bold text-[#3D3438] text-sm">{patientName}</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Patient</span>
            </div>
          </div>

          <div className="text-xs text-gray-400">ID: {consultation._id.slice(-8)}</div>
          <div className="text-xs text-gray-400">Booked: {formatDate(consultation.createdAt)}</div>

          {/* Condition */}
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${conditionColors[consultation.condition] || "bg-gray-100 text-gray-700"}`}>
            {conditionLabels[consultation.condition] || consultation.condition}
          </span>

          {/* Intake form */}
          {consultation.intakeForm && (
            <div>
              <button
                onClick={() => setIntakeOpen(!intakeOpen)}
                className="flex items-center justify-between w-full text-sm font-semibold text-[#3D3438]"
              >
                Intake Form
                {intakeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {intakeOpen && (
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(consultation.intakeForm).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-xs text-gray-400 uppercase">{key.replace(/([A-Z])/g, " $1")}</span>
                      <p className="text-sm text-[#3D3438] font-medium">
                        {Array.isArray(val) ? val.join(", ") : String(val)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SLA */}
          <div className={`rounded-xl p-3 text-sm font-medium ${slaBreach ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
            {slaBreach ? (
              <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> SLA Breached — {slaRemaining}</span>
            ) : (
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Within SLA — {slaRemaining}</span>
            )}
          </div>

          {/* Actions */}
          {!isCompleted && (
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/doctor/consultation/${id}/prescribe`)}
                className="w-full bg-[#D97894] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#C45F7E] transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Write Prescription
              </button>
              <button
                onClick={handleMarkComplete}
                className="w-full border border-green-500 text-green-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-green-50 transition-colors"
              >
                &#10003; Mark Complete
              </button>
              <button
                onClick={handleEscalate}
                className="w-full border border-amber-500 text-amber-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-amber-50 transition-colors"
              >
                &#9888; Escalate Case
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE: Chat */}
      <div className="lg:col-span-6">
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col h-[650px]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#3D3438]">Consultation Chat</h3>
              <p className="text-xs text-gray-400">{patientName}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              consultation.status === "active" ? "bg-green-100 text-green-700" :
              consultation.status === "completed" ? "bg-gray-100 text-gray-600" :
              "bg-amber-100 text-amber-700"
            }`}>
              {consultation.status}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-8">No messages yet.</p>
            )}
            {messages.map((msg, i) => {
              const isDoctor = msg.senderRole === "doctor";
              return (
                <div key={i} className={`flex ${isDoctor ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%]">
                    <p className={`text-xs mb-1 ${isDoctor ? "text-right text-gray-400" : "text-gray-400"}`}>
                      {isDoctor ? `Dr. ${doctorName}` : "Patient"}
                    </p>
                    <div className={`px-4 py-3 text-sm ${
                      isDoctor
                        ? "bg-[#D97894] text-white rounded-2xl rounded-tr-sm"
                        : "bg-gray-50 border rounded-2xl rounded-tl-sm text-gray-800"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isDoctor ? "text-white/60" : "text-gray-400"}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-100 p-4">
            {isCompleted ? (
              <p className="text-center text-sm text-gray-400">This consultation is closed.</p>
            ) : (
              <>
                <div className="flex items-end gap-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    placeholder="Type your medical response... (Ctrl+Enter to send)"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D97894] focus:border-[#D97894] outline-none resize-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="w-10 h-10 rounded-full bg-[#D97894] text-white flex items-center justify-center hover:bg-[#C45F7E] disabled:opacity-50 transition-colors shrink-0"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {quickReplies.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => setNewMessage((prev) => prev ? prev + "\n" + qr : qr)}
                      className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-[#D97894] hover:text-[#D97894] transition-colors"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Notes */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 sticky top-6 space-y-4">
          <h3 className="font-bold text-[#3D3438]">Clinical Notes</h3>
          <textarea
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            rows={6}
            placeholder="Add private notes (not visible to patient)..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#D97894] outline-none resize-none"
          />
          <button
            onClick={() => toast.success("Notes saved")}
            className="w-full border border-[#D97894] text-[#D97894] rounded-xl py-2 text-sm font-semibold hover:bg-rose-50 transition-colors"
          >
            Save Notes
          </button>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-[#3D3438] mb-2">Prescription Status</h4>
            {consultation.prescription ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Prescription issued
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-400">No prescription issued yet</p>
                {!isCompleted && (
                  <button
                    onClick={() => router.push(`/doctor/consultation/${id}/prescribe`)}
                    className="text-sm text-[#D97894] font-semibold mt-1 hover:text-[#C45F7E]"
                  >
                    Write Prescription &rarr;
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-[#3D3438] mb-2">Patient History</h4>
            <p className="text-sm text-gray-400">No previous consultations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
