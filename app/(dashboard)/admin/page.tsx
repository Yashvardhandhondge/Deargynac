"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Users, ClipboardList, Activity, AlertTriangle, RefreshCw } from "lucide-react";

interface Stats { totalUsers: number; totalConsultations: number; activeNow: number; slaBreachesToday: number }
interface ConsultationRow {
  _id: string; condition: string; status: string; paymentStatus: string; createdAt: string;
  patientId?: { name: string; alias: string; isAnonymous: boolean };
  doctorId?: { name: string };
}

const conditionColors: Record<string, string> = { pcos: "bg-rose-100 text-rose-700", periods: "bg-purple-100 text-purple-700", uti: "bg-red-100 text-red-700", pregnancy: "bg-pink-100 text-pink-700", other: "bg-gray-100 text-gray-700" };
const statusColors: Record<string, string> = { pending: "bg-amber-100 text-amber-700", active: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700", escalated: "bg-red-100 text-red-700" };
const conditionLabels: Record<string, string> = { pcos: "PCOS", periods: "Periods", uti: "UTI", discharge: "Discharge", pain: "Pain", pregnancy: "Pregnancy", diagnostics: "Diagnostics", other: "Other" };

export default function AdminDashboard() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [consultations, setConsultations] = useState<ConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<string>("checking...");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/consultations?limit=10").then((r) => r.json()),
      fetch("/api/health").then((r) => r.json()),
    ]).then(([s, c, h]) => {
      if (s.success) setStats(s);
      if (c.success) setConsultations(c.consultations || []);
      setHealthStatus(h.status === "ok" ? "Connected" : "Error");
      setLastUpdated(new Date().toLocaleTimeString());
    }).catch(() => setHealthStatus("Error")).finally(() => setLoading(false));
  };

  useEffect(() => { if (sessionStatus === 'authenticated') fetchData(); }, [sessionStatus]);

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-[#C2185B]", bg: "bg-rose-50" },
    { label: "Total Consultations", value: stats.totalConsultations, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Right Now", value: stats.activeNow, icon: Activity, color: "text-green-600", bg: "bg-green-50" },
    { label: "SLA Breaches Today", value: stats.slaBreachesToday, icon: AlertTriangle, color: "text-amber-600", bg: stats.slaBreachesToday > 0 ? "bg-red-50" : "bg-amber-50" },
  ] : [];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? [1,2,3,4].map((i) => <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 h-24 animate-pulse" />) :
          statCards.map((c) => { const Icon = c.icon; return (
            <div key={c.label} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${c.color}`} /></div>
                <div><div className={`text-3xl font-bold ${c.color}`}>{c.value}</div><div className="text-xs text-gray-400 uppercase">{c.label}</div></div>
              </div>
            </div>);
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A0A12] font-serif">Recent Consultations</h3>
            <button onClick={() => router.push("/admin/consultations")} className="text-sm text-[#C2185B] font-semibold hover:text-[#880E4F]">View All &rarr;</button>
          </div>
          {loading ? <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />)}</div> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
                <th className="text-left py-2">Patient</th><th className="text-left py-2">Doctor</th><th className="text-left py-2">Condition</th>
                <th className="text-left py-2">Status</th><th className="text-left py-2">Payment</th><th className="text-left py-2">Date</th>
              </tr></thead>
              <tbody>{consultations.map((c) => {
                const pName = c.patientId?.isAnonymous ? c.patientId.alias : c.patientId?.name || "—";
                return (
                  <tr key={c._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-2.5 font-medium text-[#1A0A12] max-w-[120px] truncate">{pName}</td>
                    <td className="py-2.5 text-gray-500">{c.doctorId?.name || <span className="text-gray-300">Unassigned</span>}</td>
                    <td className="py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColors[c.condition] || "bg-gray-100 text-gray-700"}`}>{conditionLabels[c.condition] || c.condition}</span></td>
                    <td className="py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[c.status] || "bg-gray-100 text-gray-600"}`}>{c.status}</span></td>
                    <td className="py-2.5"><span className={`text-xs font-medium ${c.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}>{c.paymentStatus === "paid" ? "Paid" : "Pending"}</span></td>
                    <td className="py-2.5 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  </tr>);
              })}</tbody>
            </table>
          </div>}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A0A12] font-serif">System Health</h3>
            <button onClick={fetchData} className="p-1.5 text-gray-400 hover:text-gray-600"><RefreshCw className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Database</span>
              <span className={`flex items-center gap-1.5 font-medium ${healthStatus === "Connected" ? "text-green-600" : "text-red-600"}`}>
                <span className={`w-2 h-2 rounded-full ${healthStatus === "Connected" ? "bg-green-500" : "bg-red-500"}`} />{healthStatus}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Active Doctors</span>
              <span className="font-medium text-[#1A0A12]">3</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Pending SLA</span>
              <span className={`font-medium ${(stats?.slaBreachesToday || 0) > 0 ? "text-red-600" : "text-green-600"}`}>{stats?.slaBreachesToday || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Today&apos;s Revenue</span>
              <span className="font-medium text-[#1A0A12]">&#8377;0</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Last updated: {lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}
