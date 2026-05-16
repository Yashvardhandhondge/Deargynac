"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

type FilterTab = "all" | "pending" | "active" | "completed" | "escalated";

interface PatientPop {
  name?: string;
  alias?: string;
  isAnonymous?: boolean;
}

interface ConsultationRow {
  _id: string;
  condition?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  responseDeadline?: string;
  paymentStatus?: string;
  amount?: number;
  pricingRule?: string;
  patientId?: PatientPop | string;
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "escalated", label: "Escalated" },
];

const CONDITION_LABELS: Record<string, string> = {
  pcos: "PCOS",
  periods: "Periods",
  pregnancy: "Pregnancy",
  uti: "UTI",
  pain: "Pain",
  discharge: "Discharge",
  diagnostics: "Diagnostics",
  fertility: "Fertility",
  hormone: "Hormone",
  ayurvedic: "Ayurvedic",
  mental: "Mental",
  other: "Other",
};

const CONDITION_BADGE: Record<string, string> = {
  pcos: "bg-rose-100 text-rose-800",
  periods: "bg-purple-100 text-purple-800",
  pregnancy: "bg-teal-100 text-teal-800",
  uti: "bg-orange-100 text-orange-800",
  pain: "bg-red-100 text-red-800",
  discharge: "bg-blue-100 text-blue-800",
  diagnostics: "bg-amber-100 text-amber-800",
  fertility: "bg-cyan-100 text-cyan-800",
  hormone: "bg-violet-100 text-violet-800",
  ayurvedic: "bg-emerald-100 text-emerald-800",
  mental: "bg-fuchsia-100 text-fuchsia-800",
  other: "bg-gray-100 text-gray-700",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  escalated: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const PAGE_SIZE = 10;

function patientLabel(c: ConsultationRow): string {
  const p = c.patientId;
  if (!p || typeof p === "string") return "Patient";
  if (p.isAnonymous && p.alias) return p.alias;
  return p.name || p.alias || "Patient";
}

function patientInitials(c: ConsultationRow): string {
  const label = patientLabel(c);
  const parts = label.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return label.slice(0, 2).toUpperCase() || "?";
}

function formatBooked(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function minutesLeft(deadline: string) {
  return Math.floor((new Date(deadline).getTime() - Date.now()) / 60000);
}

function slaCell(c: ConsultationRow) {
  const deadline = c.responseDeadline;
  const st = c.status;

  if (st === "completed") {
    if (!deadline) {
      return <span className="text-gray-400 text-sm">—</span>;
    }
    const end = new Date(c.updatedAt || c.createdAt).getTime();
    const met = end <= new Date(deadline).getTime();
    return met ? (
      <span className="text-green-600 text-sm font-medium">✓ Met</span>
    ) : (
      <span className="text-red-600 text-sm font-medium">✗ Breached</span>
    );
  }

  if (st === "cancelled") {
    return <span className="text-gray-400 text-sm">—</span>;
  }

  if (st === "escalated") {
    return <span className="text-red-600 text-sm font-medium">⚠ Escalated</span>;
  }

  if (!deadline) {
    return <span className="text-gray-400 text-sm">—</span>;
  }

  const breached = Date.now() > new Date(deadline).getTime();
  if (breached) {
    return <span className="text-red-600 text-sm font-medium">⚠ Breached</span>;
  }
  const left = minutesLeft(deadline);
  const display = left < 1 ? "<1 min left" : `${left} min left`;
  return (
    <span className="text-amber-700 text-sm font-medium">⏳ {display}</span>
  );
}

function paymentCell(c: ConsultationRow) {
  const paid = c.paymentStatus === "paid";
  const amt = c.amount ?? 149;
  const waived =
    paid &&
    (amt === 0 ||
      c.pricingRule === "first_consult_waived");
  if (waived) {
    return (
      <span className="text-green-700 text-sm font-medium">
        Complimentary
        <span className="block text-xs font-normal text-green-600/90">First visit</span>
      </span>
    );
  }
  if (paid) {
    return (
      <span className="text-green-700 text-sm font-medium">Paid ₹{amt}</span>
    );
  }
  return <span className="text-amber-700 text-sm font-medium">Pending</span>;
}

function emptyMessage(tab: FilterTab, hasAny: boolean): { icon?: boolean; text: string } {
  if (!hasAny) {
    return { text: "No consultations assigned yet" };
  }
  if (tab === "pending") {
    return { icon: true, text: "All caught up!" };
  }
  if (tab === "completed") {
    return { text: "No completed consultations yet" };
  }
  if (tab === "active") {
    return { text: "No active consultations" };
  }
  if (tab === "escalated") {
    return { text: "No escalated consultations" };
  }
  return { text: "No consultations in this view" };
}

export default function DoctorAllConsultationsPage() {
  const { status } = useSession();
  const [rows, setRows] = useState<ConsultationRow[]>([]);
  const [totalServer, setTotalServer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/doctor/consultations?status=all");
      const data = await res.json();
      if (data.success && Array.isArray(data.consultations)) {
        setRows(data.consultations);
        setTotalServer(typeof data.total === "number" ? data.total : data.consultations.length);
      } else {
        setRows([]);
        setTotalServer(0);
      }
    } catch {
      setRows([]);
      setTotalServer(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    load();
  }, [status, load]);

  const filtered = useMemo(() => {
    let list = rows;
    if (filterTab !== "all") {
      list = list.filter((c) => c.status === filterTab);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const name = patientLabel(c).toLowerCase();
        const cond = (c.condition || "").toLowerCase();
        const condLabel = (CONDITION_LABELS[c.condition || ""] || "").toLowerCase();
        return (
          name.includes(q) ||
          cond.includes(q) ||
          condLabel.includes(q)
        );
      });
    }
    return list;
  }, [rows, filterTab, search]);

  useEffect(() => {
    setPage(1);
  }, [filterTab, search]);

  const totalFiltered = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageSlice = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const displayFrom = totalFiltered === 0 ? 0 : startIdx + 1;
  const displayTo = Math.min(startIdx + PAGE_SIZE, totalFiltered);

  const hasAnyAssigned = rows.length > 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-bold text-2xl text-[#3D3438]">All Consultations</h2>
          <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-800 text-sm font-semibold px-3 py-0.5">
            {loading ? "…" : totalServer}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterTab(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filterTab === key
                  ? "bg-rose-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by patient name or condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#3D3438] placeholder:text-gray-400 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {loading ? (
        <>
          <div className="hidden md:block rounded-xl border border-gray-100 bg-white overflow-hidden">
            <div className="animate-pulse divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-1/3 bg-gray-100 rounded" />
                    <div className="h-3 w-1/4 bg-gray-50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:hidden space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white p-4 animate-pulse"
              >
                <div className="h-4 w-2/3 bg-gray-100 rounded mb-3" />
                <div className="h-3 w-1/2 bg-gray-50 rounded mb-4" />
                <div className="h-10 bg-gray-50 rounded-lg" />
              </div>
            ))}
          </div>
        </>
      ) : totalFiltered === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center px-4">
          {emptyMessage(filterTab, hasAnyAssigned).icon && (
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          )}
          <p className="text-gray-600 font-medium">
            {emptyMessage(filterTab, hasAnyAssigned).text}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-gray-200 bg-white overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-gray-600">
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Condition</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Booked</th>
                  <th className="px-4 py-3 font-semibold">SLA</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageSlice.map((c) => {
                  const condKey = c.condition || "other";
                  const condClass =
                    CONDITION_BADGE[condKey] || CONDITION_BADGE.other;
                  const stClass =
                    STATUS_BADGE[c.status] || "bg-gray-100 text-gray-700";
                  return (
                    <tr key={c._id} className="hover:bg-rose-50/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                            {patientInitials(c)}
                          </div>
                          <span className="font-medium text-[#3D3438]">
                            {patientLabel(c)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${condClass}`}
                        >
                          {CONDITION_LABELS[condKey] || condKey}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${stClass}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {formatBooked(c.createdAt)}
                      </td>
                      <td className="px-4 py-3">{slaCell(c)}</td>
                      <td className="px-4 py-3">{paymentCell(c)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/doctor/consultation/${c._id}`}
                          className="inline-flex items-center rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {pageSlice.map((c) => {
              const condKey = c.condition || "other";
              const condClass =
                CONDITION_BADGE[condKey] || CONDITION_BADGE.other;
              const stClass =
                STATUS_BADGE[c.status] || "bg-gray-100 text-gray-700";
              return (
                <div
                  key={c._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 mb-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${condClass}`}
                    >
                      {CONDITION_LABELS[condKey] || condKey}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 font-semibold capitalize ${stClass}`}
                    >
                      {c.status}
                    </span>
                    <span className="text-gray-500 ml-auto">
                      {formatBooked(c.createdAt)}
                    </span>
                  </div>
                  <p className="font-semibold text-[#3D3438] mb-2">
                    {patientLabel(c)}
                  </p>
                  <div className="mb-3 text-sm">{slaCell(c)}</div>
                  <Link
                    href={`/doctor/consultation/${c._id}`}
                    className="flex w-full items-center justify-center rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
                  >
                    Open Case →
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
            <p>
              Displaying {displayFrom}-{displayTo} of {totalFiltered} consultations
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-[#3D3438] disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-[#3D3438] disabled:opacity-40 disabled:pointer-events-none hover:bg-gray-50"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
