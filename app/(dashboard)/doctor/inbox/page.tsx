'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface ConsultationItem {
  _id: string;
  condition: string;
  status: string;
  type: string;
  createdAt: string;
  responseDeadline?: string;
  intakeForm?: Record<string, any>;
  patientId?: { name: string; alias: string; isAnonymous: boolean };
}

const conditionLabels: Record<string, string> = {
  pcos: 'PCOS / Hormones', periods: 'Period Problems', uti: 'UTI / Infections',
  discharge: 'Unusual Discharge', pain: 'Pelvic Pain', pregnancy: 'Pregnancy Care',
  diagnostics: 'Diagnostics Review', other: 'Other Concern',
};

const conditionColors: Record<string, string> = {
  pcos: 'bg-rose-100 text-rose-700', periods: 'bg-purple-100 text-purple-700',
  uti: 'bg-red-100 text-red-700', pregnancy: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700', active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600', escalated: 'bg-red-100 text-red-700',
};

const filters = ['All', 'Pending', 'Active', 'Completed'];

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getSlaStatus(deadline?: string) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  const mins = Math.floor(Math.abs(diff) / 60000);
  if (diff < 0) return { breached: true, text: `⚠ SLA Breached ${mins}m ago`, color: 'text-red-600' };
  return { breached: false, text: `✓ ${mins}m remaining`, color: 'text-green-600' };
}

export default function DoctorInbox() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/doctor/consultations?status=active,pending,completed')
      .then(r => r.json())
      .then(d => { if (d.success) setConsultations(d.consultations || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? consultations
    : consultations.filter(c => c.status === filter.toLowerCase());

  // Sort: SLA breached first, then by date
  const sorted = [...filtered].sort((a, b) => {
    const aSla = getSlaStatus(a.responseDeadline);
    const bSla = getSlaStatus(b.responseDeadline);
    if (aSla?.breached && !bSla?.breached) return -1;
    if (!aSla?.breached && bSla?.breached) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pendingCount = consultations.filter(c => c.status === 'pending').length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A0A12', fontFamily: '"Playfair Display", Georgia, serif' }}>
          Case Inbox
        </h2>
        {pendingCount > 0 && (
          <span className="bg-[#C2185B] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {pendingCount}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">All caught up! No pending cases.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(c => {
            const sla = getSlaStatus(c.responseDeadline);
            const patientName = c.patientId?.isAnonymous ? c.patientId.alias : c.patientId?.name || 'Unknown';
            const symptoms = c.intakeForm?.symptoms || c.intakeForm?.associated || [];

            return (
              <div
                key={c._id}
                className={`bg-white rounded-2xl p-5 border shadow-sm ${sla?.breached ? 'border-red-200' : 'border-gray-100'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${conditionColors[c.condition] || 'bg-gray-100 text-gray-700'}`}>
                      {conditionLabels[c.condition] || c.condition}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  {sla && (
                    <span className={`text-xs font-medium ${sla.color} flex items-center gap-1`}>
                      {sla.breached && <AlertTriangle className="w-3 h-3" />}
                      {sla.text}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#1A0A12]">{patientName}</p>
                  {c.patientId?.isAnonymous && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Anonymous</span>
                  )}
                </div>

                {Array.isArray(symptoms) && symptoms.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {symptoms.slice(0, 3).map((s: string) => (
                      <span key={s} className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Submitted {timeAgo(c.createdAt)}
                  </span>
                  <button
                    onClick={() => router.push(`/doctor/consultation/${c._id}`)}
                    className="bg-[#C2185B] text-white rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-[#880E4F] transition-colors"
                  >
                    Respond to Case →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
