"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Plus, X as XIcon, Loader2 } from "lucide-react";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface ConsultationInfo {
  _id: string;
  condition: string;
  createdAt: string;
  patientId?: { name: string; alias: string; isAnonymous: boolean };
}

const frequencies = [
  { value: "OD", label: "OD (Once daily)" },
  { value: "BD", label: "BD (Twice daily)" },
  { value: "TDS", label: "TDS (Thrice daily)" },
  { value: "QID", label: "QID (Four times)" },
  { value: "SOS", label: "SOS (As needed)" },
  { value: "HS", label: "HS (At bedtime)" },
];

const conditionLabels: Record<string, string> = {
  pcos: "PCOS / Hormones",
  periods: "Period Problems",
  uti: "UTI / Infections",
  discharge: "Unusual Discharge",
  pain: "Pelvic Pain",
  pregnancy: "Pregnancy Care",
  diagnostics: "Diagnostics Review",
  other: "Other Concern",
};

const emptyMedicine: Medicine = {
  name: "",
  dosage: "",
  frequency: "OD",
  duration: "",
  instructions: "",
};

export default function PrescribePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const doctorName = (session?.user as any)?.name || "Doctor";

  const [consultation, setConsultation] = useState<ConsultationInfo | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([{ ...emptyMedicine }]);
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [urgency, setUrgency] = useState("routine");
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/consultation/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setConsultation(json.consultation);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [id]);

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    setMedicines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addMedicine = () => {
    if (medicines.length >= 10) return;
    setMedicines((prev) => [...prev, { ...emptyMedicine }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length <= 1) return;
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const valid = medicines.some((m) => m.name.trim() && m.dosage.trim());
    if (!valid) {
      toast.error("At least one medicine with name and dosage is required");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/consultation/${id}/prescribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicines: medicines.filter((m) => m.name.trim()),
          notes,
          followUpDate: followUpDate || undefined,
          urgency,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Prescription issued successfully!");
        router.push(`/doctor/consultation/${id}`);
      } else {
        toast.error(json.message || "Failed to issue prescription");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  const patientName = consultation?.patientId?.isAnonymous
    ? consultation.patientId.alias || "Anonymous"
    : consultation?.patientId?.name || "Patient";

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">Issue Prescription</h2>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-sm">
            {patientName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1A0A12]">{patientName}</p>
            <span className="text-xs text-gray-400">
              {conditionLabels[consultation?.condition || ""] || consultation?.condition} &middot; ID: {id?.toString().slice(-8)}
            </span>
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mt-6">
        <h3 className="font-bold text-[#1A0A12] mb-4">Medications</h3>

        {medicines.map((med, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 relative">
            {medicines.length > 1 && (
              <button
                onClick={() => removeMedicine(i)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Medicine Name *</label>
                <input
                  value={med.name}
                  onChange={(e) => updateMedicine(i, "name", e.target.value)}
                  placeholder="e.g. Metformin 500mg"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Dosage *</label>
                <input
                  value={med.dosage}
                  onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                  placeholder="e.g. 1 tablet"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                <select
                  value={med.frequency}
                  onChange={(e) => updateMedicine(i, "frequency", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none bg-white"
                >
                  {frequencies.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                <input
                  value={med.duration}
                  onChange={(e) => updateMedicine(i, "duration", e.target.value)}
                  placeholder="e.g. 30 days"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Instructions</label>
                <input
                  value={med.instructions}
                  onChange={(e) => updateMedicine(i, "instructions", e.target.value)}
                  placeholder="e.g. After meals"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addMedicine}
          disabled={medicines.length >= 10}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm font-medium text-gray-500 hover:border-[#C2185B] hover:text-[#C2185B] transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Another Medicine
        </button>
      </div>

      {/* Additional details */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Doctor&apos;s Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Additional notes, lifestyle advice, dietary recommendations..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Follow-up Date</label>
          <input
            type="date"
            min={today}
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
          <div className="flex gap-4">
            {["routine", "urgent", "emergency"].map((u) => (
              <label key={u} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value={u}
                  checked={urgency === u}
                  onChange={() => setUrgency(u)}
                  className="accent-[#C2185B]"
                />
                <span className="text-sm capitalize text-gray-700">{u}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-[#FDF8F5] border border-rose-100 rounded-2xl p-6 mt-6">
        <h3 className="font-bold text-[#1A0A12] mb-4">Prescription Preview</h3>
        <div className="bg-white rounded-xl p-6 text-sm space-y-3 border border-gray-100">
          <div className="flex items-baseline border-b border-gray-100 pb-3">
            <span className="font-serif font-bold text-lg text-[#1A0A12]">Dear</span>
            <span className="font-serif italic text-lg text-[#C2185B]">Gynac</span>
            <span className="text-[#D4A017] font-bold text-xl">.</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>Patient: <span className="text-[#1A0A12] font-medium">{patientName}</span></div>
            <div>Date: <span className="text-[#1A0A12] font-medium">{new Date().toLocaleDateString("en-IN")}</span></div>
            <div>Doctor: <span className="text-[#1A0A12] font-medium">Dr. {doctorName}</span></div>
            <div>ID: <span className="text-[#1A0A12] font-medium">{id?.toString().slice(-8)}</span></div>
          </div>

          {medicines.some((m) => m.name.trim()) && (
            <table className="w-full text-xs mt-3">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-1">Medicine</th>
                  <th className="text-left py-1">Dosage</th>
                  <th className="text-left py-1">Freq</th>
                  <th className="text-left py-1">Duration</th>
                  <th className="text-left py-1">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.filter((m) => m.name.trim()).map((m, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 font-medium text-[#1A0A12]">{m.name}</td>
                    <td className="py-1.5">{m.dosage}</td>
                    <td className="py-1.5">{m.frequency}</td>
                    <td className="py-1.5">{m.duration || "—"}</td>
                    <td className="py-1.5">{m.instructions || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {notes && (
            <div className="mt-2">
              <span className="text-xs text-gray-400">Notes:</span>
              <p className="text-sm text-[#1A0A12]">{notes}</p>
            </div>
          )}
          {followUpDate && (
            <div>
              <span className="text-xs text-gray-400">Follow-up:</span>{" "}
              <span className="text-sm text-[#1A0A12]">{new Date(followUpDate).toLocaleDateString("en-IN")}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-3 mt-4 text-right text-xs text-gray-400">
            Dr. {doctorName} — Digital Signature
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-[#C2185B] text-white rounded-full py-4 text-base font-semibold hover:bg-[#880E4F] transition-colors mt-6 mb-8 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Issuing Prescription...</>
        ) : (
          <><span>&#10003;</span> Issue Prescription</>
        )}
      </button>
    </div>
  );
}
