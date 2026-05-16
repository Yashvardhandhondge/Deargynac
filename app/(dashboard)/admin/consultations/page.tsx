"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface ConsultationRow {
  _id: string; condition: string; status: string; paymentStatus: string; createdAt: string; responseDeadline?: string;
  amount?: number;
  pricingRule?: string;
  patientId?: { name: string; alias: string; isAnonymous: boolean };
  doctorId?: { name: string };
}

const statuses = ["all", "pending", "active", "completed", "escalated", "cancelled"];
const conditions = ["all", "pcos", "periods", "uti", "discharge", "pain", "pregnancy", "diagnostics", "fertility", "hormone", "ayurvedic", "mental", "other"];
const conditionLabels: Record<string, string> = { pcos: "PCOS", periods: "Periods", uti: "UTI", discharge: "Discharge", pain: "Pain", pregnancy: "Pregnancy", diagnostics: "Diagnostics", fertility: "Fertility", hormone: "Hormone", ayurvedic: "Ayurvedic", mental: "Mental", other: "Other" };
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
const statusColors: Record<string, string> = { pending: "bg-amber-100 text-amber-700", active: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700", escalated: "bg-red-100 text-red-700" };

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<ConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (conditionFilter !== "all") params.set("condition", conditionFilter);
    if (search) params.set("search", search);
    fetch(`/api/admin/consultations?${params}`).then((r) => r.json()).then((d) => {
      if (d.success) { setConsultations(d.consultations || []); setTotalPages(d.totalPages || 1); setTotal(d.total || 0); }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page, statusFilter, conditionFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getSlaStatus = (c: ConsultationRow) => {
    if (c.status === "completed") return <span className="text-xs text-green-600 font-medium">&#10003; Met</span>;
    if (!c.responseDeadline) return <span className="text-xs text-gray-400">—</span>;
    if (new Date(c.responseDeadline) < new Date()) return <span className="text-xs text-red-600 font-medium">&#10007; Breached</span>;
    return <span className="text-xs text-amber-600 font-medium">&#9203; Active</span>;
  };

  return (
    <div>
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex gap-1 flex-wrap">
          {statuses.map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors capitalize ${statusFilter === s ? "bg-[#D97894] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
        <select value={conditionFilter} onChange={(e) => { setConditionFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-[#D97894] outline-none">
          {conditions.map((c) => <option key={c} value={c}>{c === "all" ? "All Conditions" : conditionLabels[c] || c}</option>)}
        </select>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search patient..." className="text-sm outline-none bg-transparent w-40" />
        </div>
        {(statusFilter !== "all" || conditionFilter !== "all" || search) && (
          <button onClick={() => { setStatusFilter("all"); setConditionFilter("all"); setSearch(""); setPage(1); }} className="text-xs text-[#D97894] font-medium">Clear Filters</button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 mt-4 overflow-hidden">
        {loading ? <div className="p-6 space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />)}</div> :
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-xs text-gray-400 uppercase bg-gray-50">
              <th className="text-left px-4 py-3">ID</th><th className="text-left px-4 py-3">Patient</th><th className="text-left px-4 py-3">Doctor</th>
              <th className="text-left px-4 py-3">Condition</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Payment</th>
              <th className="text-left px-4 py-3">SLA</th><th className="text-left px-4 py-3">Date</th>
            </tr></thead>
            <tbody>{consultations.map((c) => {
              const pName = c.patientId?.isAnonymous ? c.patientId.alias : c.patientId?.name || "—";
              return (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{c._id.slice(-6)}</td>
                  <td className="px-4 py-3 font-medium text-[#3D3438] max-w-[100px] truncate">{pName}</td>
                  <td className="px-4 py-3 text-gray-500">{c.doctorId?.name || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColors[c.condition] || "bg-gray-100 text-gray-700"}`}>{conditionLabels[c.condition] || c.condition}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status] || "bg-gray-100 text-gray-600"}`}>{c.status}</span></td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${
                        c.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {c.paymentStatus === "paid"
                        ? c.amount === 0 || c.pricingRule === "first_consult_waived"
                          ? "Complimentary"
                          : "Paid"
                        : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getSlaStatus(c)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                </tr>);
            })}</tbody>
          </table>
        </div>}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Showing {((page-1)*10)+1}-{Math.min(page*10, total)} of {total}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page <= 1} className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={page >= totalPages} className="p-1.5 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
