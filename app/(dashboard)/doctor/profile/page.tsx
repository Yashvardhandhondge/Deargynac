'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Stethoscope, Star, FileText, Users } from 'lucide-react';

export default function DoctorProfile() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const name = user?.name || 'Doctor';
  const initial = name.charAt(0).toUpperCase();

  const [stats, setStats] = useState({ totalConsultations: 0, prescriptions: 0, avgRating: 0 });

  useEffect(() => {
    fetch('/api/doctor/stats')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStats({
            totalConsultations: d.totalConsultations || 0,
            prescriptions: d.prescriptions || 0,
            avgRating: d.avgRating || 4.9,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A0A12', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '1.5rem' }}>
        My Profile
      </h2>

      {/* Profile card */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto">
          {initial}
        </div>
        <h3 className="text-lg font-bold text-[#1A0A12] mt-4">{name}</h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium mt-2 inline-block">
          Doctor
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
          <Users className="w-5 h-5 text-[#C2185B] mx-auto mb-1" />
          <div className="text-xl font-bold text-[#1A0A12]">{stats.totalConsultations}</div>
          <div className="text-xs text-gray-400">Consultations</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
          <FileText className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-[#1A0A12]">{stats.prescriptions}</div>
          <div className="text-xs text-gray-400">Prescriptions</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
          <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-[#1A0A12]">{stats.avgRating}</div>
          <div className="text-xs text-gray-400">Avg Rating</div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-semibold text-[#1A0A12] mb-4">Profile Information</h3>
        <p className="text-sm text-gray-400">
          Your profile is managed by the platform admin. Contact admin to update your details.
        </p>
      </div>
    </div>
  );
}
