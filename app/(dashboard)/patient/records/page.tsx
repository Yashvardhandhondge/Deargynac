'use client';

import { useState } from 'react';
import { FolderOpen, FileText } from 'lucide-react';

export default function RecordsPage() {
  const [tab, setTab] = useState<'prescriptions' | 'reports'>('prescriptions');

  return (
    <div className="max-w-3xl mx-auto">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A0A12', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '1.5rem' }}>
        My Health Records
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('prescriptions')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === 'prescriptions' ? 'bg-[#C2185B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setTab('reports')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === 'reports' ? 'bg-[#C2185B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Reports
        </button>
      </div>

      <div className="text-center py-20">
        {tab === 'prescriptions' ? (
          <>
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">No prescriptions yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Complete a consultation to receive your first prescription.
            </p>
          </>
        ) : (
          <>
            <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">No reports yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Diagnostic reports will appear here after your consultation.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
