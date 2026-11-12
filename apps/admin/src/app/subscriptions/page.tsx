'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  CreditCard,
  Check,
  TrendingUp,
  FileText,
  DollarSign,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

const plans = [
  {
    name: 'Free Starter',
    tier: 'free',
    monthly: '৳0',
    annual: '৳0',
    students: 'Up to 100 Students',
    teachers: '10 Teachers',
    storage: '2 GB Cloud Storage',
    features: ['Daily Attendance', 'Student & Parent Portal', 'Basic Reports'],
    activeCampuses: 6,
    badge: 'Pilot',
  },
  {
    name: 'Basic Campus',
    tier: 'basic',
    monthly: '৳2,500',
    annual: '৳25,000',
    students: 'Up to 500 Students',
    teachers: '35 Teachers',
    storage: '20 GB Cloud Storage',
    features: ['Attendance & Timetable', 'Fee Management', 'SMS & Push Alerts', 'Examination Schedules'],
    activeCampuses: 18,
    badge: 'Popular',
  },
  {
    name: 'Pro Campus',
    tier: 'pro',
    monthly: '৳6,500',
    annual: '৳65,000',
    students: 'Up to 2,500 Students',
    teachers: '150 Teachers',
    storage: '100 GB Cloud Storage',
    features: ['All Basic Features', 'bKash / Nagad / SSLCommerz', 'Digital Library & Transport', 'SDUI Dynamic Customizer', 'Digital Receipts & Invoicing'],
    activeCampuses: 21,
    badge: 'Recommended',
  },
  {
    name: 'Enterprise Multi-Branch',
    tier: 'enterprise',
    monthly: '৳15,000',
    annual: '৳150,000',
    students: 'Unlimited Students',
    teachers: '500+ Teachers',
    storage: '500 GB Cloud Storage',
    features: ['All Pro Features', 'White-label Custom Domain', 'Biometric Hardware Sync', 'Dedicated Database Node', '24/7 SLA Guarantee'],
    activeCampuses: 3,
    badge: 'Enterprise',
  },
];

const invoices = [
  { id: 'INV-2026-081', campus: 'Dhaka Premier International', amount: '৳65,000', plan: 'Pro Annual', date: '2026-01-15', status: 'Paid', method: 'bKash Checkout' },
  { id: 'INV-2026-082', campus: 'Chittagong Model College', amount: '৳25,000', plan: 'Basic Annual', date: '2026-02-01', status: 'Paid', method: 'SSLCommerz' },
  { id: 'INV-2026-083', campus: 'Rajshahi Scholars School', amount: '৳6,500', plan: 'Pro Monthly', date: '2026-02-10', status: 'Paid', method: 'Nagad' },
  { id: 'INV-2026-084', campus: 'Sylhet Global Academy', amount: '৳0', plan: 'Free Trial', date: '2026-02-12', status: 'Trial', method: 'N/A' },
];

export default function SubscriptionsPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader title="Subscription & Billing Governance" subtitle="Manage SaaS pricing tiers, limits, and platform revenue" />

      <main className="p-8 space-y-8 flex-1 overflow-y-auto">
        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`bg-[#131D38] border rounded-2xl p-6 flex flex-col justify-between transition hover:border-blue-500/50 ${
                p.tier === 'pro' ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                    {p.badge}
                  </span>
                  <span className="text-xs bg-blue-500/10 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/20">
                    {p.activeCampuses} Campuses
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-2xl font-extrabold text-white">{p.monthly}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">{p.annual} billed annually</p>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                  <div className="font-semibold text-white">{p.students}</div>
                  <div>{p.teachers}</div>
                  <div>{p.storage}</div>
                </div>

                <div className="space-y-1.5 mt-4 pt-4 border-t border-slate-800/60 text-[11px]">
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => alert(`Configuring tier quotas for ${p.name}`)}
                className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
              >
                Configure Quotas
              </button>
            </div>
          ))}
        </div>

        {/* Invoices Table */}
        <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Platform SaaS Invoices</h3>
              <p className="text-xs text-slate-400">Verified subscription payments collected</p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 font-semibold">Invoice ID</th>
                <th className="pb-3 font-semibold">Campus Name</th>
                <th className="pb-3 font-semibold">Plan</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Gateway</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-mono text-blue-400 font-semibold">{inv.id}</td>
                  <td className="py-3 font-semibold text-slate-200">{inv.campus}</td>
                  <td className="py-3 text-slate-300">{inv.plan}</td>
                  <td className="py-3 font-extrabold text-white">{inv.amount}</td>
                  <td className="py-3 text-slate-400">{inv.method}</td>
                  <td className="py-3 text-slate-400">{inv.date}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[10px]">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => alert(`Downloading PDF invoice for ${inv.id}`)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded transition"
                      title="Download Invoice"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
