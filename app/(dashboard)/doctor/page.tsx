"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Timer,
  AlertTriangle,
} from "lucide-react";

interface Stats {
  todayCases: number;
  pendingResponse: number;
  completedThisWeek: number;
  avgResponseMinutes: number;
}

interface CaseItem {
  _id: string;
  condition: string;
  status: string;
  createdAt: string;
  responseDeadline?: string;
  intakeForm?: Record<string, any>;
  patientId?: { name: string; alias: string; isAnonymous: boolean };
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
  pain: "bg-amber-100 text-amber-700",
  pregnancy: "bg-pink-100 text-pink-700",
  diagnostics: "bg-amber-100 text-amber-800",
  fertility: "bg-cyan-100 text-cyan-800",
  hormone: "bg-violet-100 text-violet-800",
  ayurvedic: "bg-emerald-100 text-emerald-800",
  mental: "bg-fuchsia-100 text-fuchsia-800",
  other: "bg-gray-100 text-gray-700",
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;
    Promise.all([
      fetch("/api/doctor/stats").then((r) => r.json()),
      fetch("/api/doctor/consultations?status=active,pending").then((r) => r.json()),
    ])
      .then(([statsData, casesData]) => {
        if (statsData.success) setStats(statsData);
        if (casesData.success) setCases(casesData.consultations || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const statCards = stats
    ? [
        {
          label: "Today's Cases",
          value: stats.todayCases,
          icon: ClipboardList,
          color: "text-[#D97894]",
          bg: "bg-rose-50",
        },
        {
          label: "Pending Response",
          value: stats.pendingResponse,
          icon: Clock,
          color: "text-amber-500",
          bg: stats.pendingResponse > 0 ? "bg-amber-50" : "bg-gray-50",
        },
        {
          label: "Completed This Week",
          value: stats.completedThisWeek,
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
        },
        {
          label: "Avg Response Time",
          value: `${stats.avgResponseMinutes} min`,
          icon: Timer,
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
      ]
    : [];

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 h-24 animate-pulse" />
            ))
          : statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div>
                      <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                      <div className="text-xs text-gray-400 uppercase">{card.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Case inbox + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Active cases */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#3D3438] font-serif">Active Cases</h3>
              {cases.length > 0 && (
                <span className="bg-[#D97894] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cases.length}
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">All caught up!</p>
              <p className="text-gray-400 text-sm">No pending cases.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cases.map((c) => {
                const isBreach =
                  c.responseDeadline && new Date(c.responseDeadline) < new Date() && c.status !== "completed";
                const patientName =
                  c.patientId?.isAnonymous
                    ? c.patientId.alias || "Anonymous"
                    : c.patientId?.name || "Patient";
                return (
                  <div key={c._id} className="flex items-center justify-between py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            conditionColors[c.condition] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {conditionLabels[c.condition] || c.condition}
                        </span>
                        <span className="text-sm font-semibold text-[#3D3438]">
                          {patientName}
                        </span>
                        {isBreach && (
                          <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            SLA Breach
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {c.intakeForm
                          ? Object.values(c.intakeForm).slice(0, 2).join(" · ")
                          : "No intake details"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span
                        className={`text-xs ${isBreach ? "text-red-500 font-semibold" : "text-gray-400"}`}
                      >
                        {timeAgo(c.createdAt)}
                      </span>
                      <button
                        onClick={() => router.push(`/doctor/consultation/${c._id}`)}
                        className="text-xs bg-[#D97894] text-white px-3 py-1.5 rounded-full font-semibold hover:bg-[#C45F7E] transition-colors"
                      >
                        Respond &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick stats sidebar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-[#3D3438] font-serif mb-4">Today&apos;s Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Consultations responded</span>
              <span className="font-bold text-[#3D3438]">{stats?.completedThisWeek || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Prescriptions issued</span>
              <span className="font-bold text-[#3D3438]">—</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avg satisfaction</span>
              <span className="font-bold text-[#D4A017]">4.9 &#9733;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
