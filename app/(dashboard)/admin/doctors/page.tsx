"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, X as XIcon } from "lucide-react";

interface Doctor {
  _id: string; name: string; email?: string; phone?: string; specialty?: string;
  mrnNumber?: string; experience?: number; rating?: number; isActive: boolean; bio?: string;
}

const specColors: Record<string, string> = { gynecologist: "bg-rose-100 text-rose-700", radiologist: "bg-purple-100 text-purple-700", surgeon: "bg-teal-100 text-teal-700" };

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", specialty: "gynecologist", mrnNumber: "", experience: "", bio: "" });

  const fetchDoctors = () => {
    setLoading(true);
    fetch("/api/admin/doctors").then((r) => r.json()).then((d) => { if (d.success) setDoctors(d.doctors || []); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !isActive }) });
      const json = await res.json();
      if (json.success) { setDoctors((prev) => prev.map((d) => d._id === id ? { ...d, isActive: !isActive } : d)); toast.success(`Doctor ${!isActive ? "activated" : "deactivated"}`); }
    } catch { toast.error("Failed to update"); }
  };

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.phone || !form.mrnNumber) { toast.error("Please fill all required fields"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/doctors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, experience: parseInt(form.experience) || 0 }) });
      const json = await res.json();
      if (json.success) { toast.success("Doctor added successfully"); setDialogOpen(false); setForm({ name: "", email: "", phone: "", specialty: "gynecologist", mrnNumber: "", experience: "", bio: "" }); fetchDoctors(); }
      else toast.error(json.message || "Failed to add");
    } catch { toast.error("Something went wrong"); } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1A0A12] font-serif">Doctor Management</h2>
        <button onClick={() => setDialogOpen(true)} className="flex items-center gap-2 bg-[#C2185B] text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-[#880E4F] transition-colors">
          <Plus className="w-4 h-4" /> Add New Doctor
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 bg-gray-50 rounded animate-pulse" />)}</div> :
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-xs text-gray-400 uppercase bg-gray-50">
              <th className="text-left px-6 py-3">Name</th><th className="text-left px-4 py-3">Specialty</th><th className="text-left px-4 py-3">MRN</th>
              <th className="text-left px-4 py-3">Exp</th><th className="text-left px-4 py-3">Rating</th><th className="text-left px-4 py-3">Status</th>
            </tr></thead>
            <tbody>{doctors.map((doc) => (
              <tr key={doc._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4"><div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C2185B] flex items-center justify-center text-white text-xs font-semibold">{doc.name.split(" ").map((w) => w[0]).join("").slice(0,2)}</div>
                  <span className="font-medium text-[#1A0A12]">{doc.name}</span>
                </div></td>
                <td className="px-4 py-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${specColors[doc.specialty || ""] || "bg-gray-100 text-gray-700"}`}>{doc.specialty || "—"}</span></td>
                <td className="px-4 py-4 text-gray-500 font-mono text-xs">{doc.mrnNumber || "—"}</td>
                <td className="px-4 py-4 text-gray-600">{doc.experience ? `${doc.experience} yrs` : "—"}</td>
                <td className="px-4 py-4 text-amber-500 font-medium">&#9733; {doc.rating || "—"}</td>
                <td className="px-4 py-4">
                  <button onClick={() => handleToggle(doc._id, doc.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${doc.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${doc.isActive ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>}
      </div>

      {/* Add Doctor Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#1A0A12] font-serif">Add New Doctor</h3>
              <button onClick={() => setDialogOpen(false)} className="p-1 text-gray-400 hover:text-gray-600"><XIcon className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              {[{ l: "Full Name *", k: "name", t: "text", p: "Dr. Jane Doe" }, { l: "Email *", k: "email", t: "email", p: "doctor@deargynac.com" }, { l: "Phone *", k: "phone", t: "tel", p: "9876543210" }, { l: "MRN Number *", k: "mrnNumber", t: "text", p: "MH-XXXXX" }, { l: "Years of Experience", k: "experience", t: "number", p: "10" }].map((f) => (
                <div key={f.k}><label className="block text-sm font-medium text-gray-700 mb-1">{f.l}</label>
                  <input type={f.t} placeholder={f.p} value={(form as any)[f.k]} onChange={(e) => setForm((p) => ({ ...p, [f.k]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none" /></div>
              ))}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <select value={form.specialty} onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-[#C2185B] outline-none">
                  <option value="gynecologist">Gynecologist</option><option value="radiologist">Radiologist</option><option value="surgeon">General Surgeon</option>
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={3} placeholder="Brief professional bio..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C2185B] outline-none resize-none" /></div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Default password: DearGynac@123 — doctor must change on first login.</p>
            <button onClick={handleAdd} disabled={submitting} className="w-full bg-[#C2185B] text-white rounded-full py-3 font-semibold mt-4 hover:bg-[#880E4F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Doctor"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
