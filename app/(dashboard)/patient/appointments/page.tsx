'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Loader2 } from 'lucide-react';

interface AppointmentItem {
  _id: string;
  condition: string;
  status: string;
  type: string;
  createdAt: string;
  doctorId?: { name: string; specialty: string };
}

const conditionLabels: Record<string, string> = {
  pcos: 'PCOS / Hormones', periods: 'Period Problems', uti: 'UTI / Infections',
  discharge: 'Unusual Discharge', pain: 'Pelvic Pain', pregnancy: 'Pregnancy Care',
  diagnostics: 'Diagnostics Review', fertility: 'Fertility & Conception',
  hormone: 'Hormone & Cycle Health', ayurvedic: 'Ayurvedic / Integrative',
  mental: 'Mental & Sexual Wellness', other: 'Other Concern',
};

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/consultation/my')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setAppointments(
            (d.consultations || []).filter((c: any) => c.status === 'active' || c.status === 'pending')
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3D3438', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '1.5rem' }}>
        My Appointments
      </h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#D97894] animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">No upcoming appointments</p>
          <p className="text-gray-400 text-sm mt-1">Book a consultation to get started</p>
          <button
            onClick={() => router.push('/patient/book')}
            className="mt-6 bg-[#D97894] text-white rounded-full px-6 py-3 font-semibold hover:bg-[#C45F7E] transition-colors"
          >
            Book a Consultation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(a => (
            <div
              key={a._id}
              onClick={() => router.push(`/patient/consultation/${a._id}`)}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#3D3438]">
                    {conditionLabels[a.condition] || a.condition}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.doctorId?.name || 'Assigning...'} · {a.type === 'async' ? 'Chat' : 'Video'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {a.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
