"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Clock, CalendarDays, Loader2 } from "lucide-react";

interface ConsultationItem {
  _id: string;
  condition: string;
  status: string;
  type: string;
  createdAt: string;
  doctorId?: { name: string; specialty: string };
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

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-600",
  escalated: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-400",
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userName =
    (session?.user as any)?.name ||
    (session?.user as any)?.alias ||
    "Patient";

  useEffect(() => {
    if (status !== 'authenticated') return;
    async function fetchConsultations() {
      try {
        const res = await fetch("/api/consultation/my");
        const json = await res.json();
        if (json.success) {
          setConsultations(json.consultations || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchConsultations();
  }, [status, pathname]);

  const activeConsultations = consultations.filter(
    (c) => c.status === "active" || c.status === "pending"
  );
  const completedConsultations = consultations.filter(
    (c) => c.status === "completed"
  );
  const thisMonth = consultations.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div>
      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-[#E8B4C8] to-[#D97894] rounded-2xl p-8 text-white shadow-sm">
          <h2 className="text-2xl font-bold font-serif">
            Good morning, {userName}!
          </h2>
          <p className="text-white/80 mt-1">
            Your health journey continues.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <button
              onClick={() => router.push("/patient/book")}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors"
            >
              New Consultation
            </button>
            <button
              onClick={() => router.push("/patient/records")}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors"
            >
              View Records
            </button>
          </div>
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#D97894]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#D97894]">
                  {consultations.length}
                </div>
                <div className="text-xs text-gray-400 uppercase">
                  Total Consultations
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#D97894]">
                  {activeConsultations.length}
                </div>
                <div className="text-xs text-gray-400 uppercase">
                  Active Cases
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#D97894]">
                  {thisMonth.length}
                </div>
                <div className="text-xs text-gray-400 uppercase">
                  This Month
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Active consultations */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-[#3D3438] font-serif mb-4">
            Active Consultations
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : activeConsultations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No active consultations</p>
              <button
                onClick={() => router.push("/patient/book")}
                className="mt-3 text-sm text-[#D97894] font-semibold hover:text-[#C45F7E] transition-colors"
              >
                Book your first consultation &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeConsultations.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#3D3438]">
                          {conditionLabels[c.condition] || c.condition}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            statusColors[c.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.doctorId?.name || "Assigning doctor..."} &middot;{" "}
                        {timeAgo(c.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/patient/consultation/${c._id}`)
                    }
                    className="text-xs text-[#D97894] font-semibold hover:text-[#C45F7E] shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
              {activeConsultations.length > 0 && (
                <button
                  onClick={() => router.push("/patient/consultations")}
                  className="w-full text-center text-sm text-[#D97894] font-semibold hover:text-[#C45F7E] py-2 transition-colors"
                >
                  View All Consultations →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-[#3D3438] font-serif mb-4">
            Recent Activity
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : completedConsultations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No completed consultations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedConsultations.slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div>
                    <span className="text-sm font-medium text-[#3D3438]">
                      {conditionLabels[c.condition] || c.condition}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {c.doctorId?.name} &middot; {timeAgo(c.createdAt)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
