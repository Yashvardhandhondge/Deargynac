'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageCircle } from 'lucide-react';

interface ConsultationItem {
  _id: string;
  condition: string;
  status: string;
  type: string;
  paymentStatus: string;
  createdAt: string;
  doctorId?: { name: string; specialty: string };
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
  cancelled: 'bg-gray-100 text-gray-400',
};

const borderColors: Record<string, string> = {
  active: '#C2185B', pending: '#D97706', completed: '#16A34A', escalated: '#DC2626',
};

const filters = ['All', 'Active', 'Pending', 'Completed'];

export default function MyConsultations() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/consultation/my')
      .then(r => r.json())
      .then(d => { if (d.success) setConsultations(d.consultations || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All'
    ? consultations
    : consultations.filter(c => c.status === filter.toLowerCase());

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A0A12', fontFamily: '"Playfair Display", Georgia, serif' }}>
          My Consultations
        </h2>
        <button
          onClick={() => router.push('/patient/book')}
          className="bg-[#C2185B] text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-[#880E4F] transition-colors"
        >
          + New
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#C2185B] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-50 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">
            {filter === 'All' ? 'No consultations yet' : `No ${filter.toLowerCase()} consultations`}
          </p>
          {filter === 'All' && (
            <button
              onClick={() => router.push('/patient/book')}
              className="mt-4 text-[#C2185B] font-semibold text-sm hover:text-[#880E4F]"
            >
              Book your first consultation →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => (
            <div
              key={c._id}
              onClick={() => router.push(`/patient/consultation/${c._id}`)}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
              style={{ borderLeft: `4px solid ${borderColors[c.status] || '#E5E7EB'}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${conditionColors[c.condition] || 'bg-gray-100 text-gray-700'}`}>
                    {conditionLabels[c.condition] || c.condition}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                    {c.status}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#1A0A12]">
                {c.doctorId?.name || 'Assigning doctor...'}
              </p>
              <p className="text-xs text-gray-400">{c.doctorId?.specialty || 'Specialist'}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-[#C2185B] font-semibold">View Consultation →</span>
                <span className={`text-xs font-medium ${c.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {c.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
