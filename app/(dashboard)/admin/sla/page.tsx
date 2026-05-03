"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { AlertTriangle, Clock, CheckCircle, Loader2, X as XIcon } from "lucide-react";

interface Breach {
  _id: string; condition: string; createdAt: string; responseDeadline: string;
  patientId?: { name: string; alias: string; isAnonymous: boolean };
  doctorId?: { name: string };
}
interface Doctor { _id: string; name: string; specialty?: string }

const conditionLabels: Record<string, string> = {
  pcos: "PCOS",
  periods: "Periods",
  uti: "UTI",
  discharge: "Discharge",
  pain: "Pain",
  pregnancy: "Pregnancy",
  diagnostics: "Diagnostics",
  fertility: "Fertility",
  hormone: "Hormone",
  ayurvedic: "Ayurvedic",
  mental: "Mental",
  other: "Other",
};

export default function SlaMonitorPage() {
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [reassignId, setReassignId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reassigning, setReassigning] = useState(false);

  const fetchBreaches = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/sla/breaches").then((r) => r.json()).then((d) => { if (d.success) setBreaches(d.breaches || []); }).catch(() => {}).finally(() => { setLoading(false); setCountdown(60); });
  }, []);

  useEffect(() => { fetchBreaches(); }, [fetchBreaches]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { fetchBreaches(); return 60; } return c - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchBreaches]);

  const openReassign = async (id: string) => {
    setReassignId(id);
    if (doctors.length === 0) {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    }
  };

  const handleReassign = async () => {
    if (!selectedDoctor || !reassignId) return;
    setReassigning(true);
    try {
      const res = await fetch(`/api/admin/consultation/${reassignId}/reassign`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doctorId: selectedDoctor }) });
      const json = await res.json();
      if (json.success) { toast.success("Doctor reassigned successfully"); setReassignId(null); setSelectedDoctor(""); fetchBreaches(); }
      else toast.error(json.message || "Failed");
    } catch { toast.error("Something went wrong"); } finally { setReassigning(false); }
  };

  const overdueMins = (deadline: string) => Math.floor((Date.now() - new Date(deadline).getTime()) / 60000);
  const complianceRate = breaches.length === 0 ? 100 : Math.max(0, 100 - breaches.length * 5);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border ${breaches.length > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <AlertTriangle className={`w-6 h-6 ${breaches.length > 0 ? "text-red-500" : "text-green-500"}`} />
          <div className={`text-3xl font-bold mt-2 ${breaches.length > 0 ? "text-red-600" : "text-green-600"}`}>{breaches.length}</div>
          <div className="text-xs text-gray-500 uppercase">Active Breaches</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <Clock className="w-6 h-6 text-blue-500" />
          <div className="text-3xl font-bold mt-2 text-blue-600">12 min</div>
          <div className="text-xs text-gray-500 uppercase">Avg Response Time</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div className="text-3xl font-bold mt-2 text-green-600">{complianceRate}%</div>
          <div className="text-xs text-gray-500 uppercase">Compliance Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 mt-6">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#3D3438] font-serif">Active SLA Breaches</h3>
            {breaches.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{breaches.length}</span>}
          </div>
          <span className="text-xs text-gray-400">Refreshing in 00:{countdown.toString().padStart(2, "0")}</span>
        </div>

        {loading ? <div className="p-6 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 bg-gray-50 rounded animate-pulse" />)}</div> :
        breaches.length === 0 ? (
          <div className="p-10 text-center"><CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" /><p className="text-gray-500 font-medium">No SLA breaches</p><p className="text-gray-400 text-sm">All consultations are within SLA.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-xs text-gray-400 uppercase bg-gray-50">
                <th className="text-left px-4 py-3">Patient</th><th className="text-left px-4 py-3">Doctor</th><th className="text-left px-4 py-3">Condition</th>
                <th className="text-left px-4 py-3">Booked</th><th className="text-left px-4 py-3">Deadline</th><th className="text-left px-4 py-3">Overdue</th><th className="text-left px-4 py-3">Action</th>
              </tr></thead>
              <tbody>{breaches.map((b) => {
                const pName = b.patientId?.isAnonymous ? b.patientId.alias : b.patientId?.name || "—";
                return (
                  <tr key={b._id} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium text-[#3D3438]">{pName}</td>
                    <td className="px-4 py-3 text-gray-500">{b.doctorId?.name || "Unassigned"}</td>
                    <td className="px-4 py-3 text-xs">{conditionLabels[b.condition] || b.condition}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(b.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(b.responseDeadline).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-4 py-3 text-red-600 font-bold">{overdueMins(b.responseDeadline)} min</td>
                    <td className="px-4 py-3"><button onClick={() => openReassign(b._id)} className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium hover:bg-amber-200 transition-colors">Reassign</button></td>
                  </tr>);
              })}</tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reassign Dialog */}
      {reassignId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setReassignId(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#3D3438]">Reassign Doctor</h3>
              <button onClick={() => setReassignId(null)} className="p-1 text-gray-400 hover:text-gray-600"><XIcon className="w-5 h-5" /></button>
            </div>
            <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#D97894] outline-none">
              <option value="">Select a doctor...</option>
              {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>)}
            </select>
            <button onClick={handleReassign} disabled={!selectedDoctor || reassigning} className="w-full bg-[#D97894] text-white rounded-full py-2.5 font-semibold mt-4 hover:bg-[#C45F7E] disabled:opacity-50 flex items-center justify-center gap-2">
              {reassigning ? <><Loader2 className="w-4 h-4 animate-spin" /> Reassigning...</> : "Reassign Doctor"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
