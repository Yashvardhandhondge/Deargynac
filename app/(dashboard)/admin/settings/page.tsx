'use client';

import { CreditCard, MessageCircle, Mail, Globe } from 'lucide-react';

const integrations = [
  {
    icon: CreditCard,
    title: 'Razorpay Payment Gateway',
    status: 'Coming Soon',
    statusColor: 'bg-amber-100 text-amber-700',
    description: 'Accept online payments for consultations via Razorpay.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Business API',
    status: 'Coming Soon',
    statusColor: 'bg-amber-100 text-amber-700',
    description: 'Send OTP, appointment reminders, and follow-ups via WhatsApp.',
  },
  {
    icon: Mail,
    title: 'Email Notifications',
    status: 'Configured',
    statusColor: 'bg-green-100 text-green-700',
    description: 'SMTP email configured for transactional emails.',
  },
  {
    icon: Globe,
    title: 'ABHA ID Integration',
    status: 'Coming Soon',
    statusColor: 'bg-amber-100 text-amber-700',
    description: 'Integrate with Ayushman Bharat Digital Health ID system.',
  },
];

export default function AdminSettings() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3D3438', fontFamily: '"Playfair Display", Georgia, serif', marginBottom: '1.5rem' }}>
        Platform Settings
      </h2>

      {/* Environment info */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <h3 className="font-semibold text-[#3D3438] mb-4">Environment</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Mode</span>
            <span className="font-medium text-green-600">Development</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Next.js</span>
            <span className="font-medium text-[#3D3438]">v16.2.3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Database</span>
            <span className="font-medium text-green-600">MongoDB Atlas</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Auth</span>
            <span className="font-medium text-[#3D3438]">NextAuth.js (OTP)</span>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <h3 className="font-semibold text-[#3D3438] mb-4">Integrations</h3>
      <div className="space-y-4">
        {integrations.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-[#3D3438] text-sm">{item.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
