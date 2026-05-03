'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Shield, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const userName = user?.name || user?.alias || 'Patient';
  const initial = userName.charAt(0).toUpperCase();
  const isAnonymous = user?.isAnonymous || false;

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/patient/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3D3438', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '1.5rem' }}>
        My Profile
      </h2>

      {/* Avatar */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#D97894] flex items-center justify-center text-white text-2xl font-bold mx-auto">
          {initial}
        </div>
        <h3 className="text-lg font-bold text-[#3D3438] mt-4">{userName}</h3>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-xs bg-rose-100 text-[#D97894] px-3 py-1 rounded-full font-medium">Patient</span>
          {isAnonymous && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" /> Anonymous
            </span>
          )}
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-semibold text-[#3D3438] mb-4">Edit Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D97894] focus:border-[#D97894] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D97894] focus:border-[#D97894] outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-[#D97894] text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-[#C45F7E] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
