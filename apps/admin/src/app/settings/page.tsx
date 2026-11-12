'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  ShieldAlert,
  Activity,
  HardDrive,
  Database,
  Lock,
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const mockAuditLogs = [
  { id: '1', user: 'admin@eduvanta.com', action: 'TENANT_PROVISION', entity: 'schools', id_val: 'SCH-DPIS-01', ip: '103.114.98.22', time: '12 mins ago' },
  { id: '2', user: 'principal@dhakapremier.edu.bd', action: 'MARKS_SUBMIT', entity: 'exam_marks', id_val: 'EXM-101', ip: '27.147.202.14', time: '34 mins ago' },
  { id: '3', user: 'admin@eduvanta.com', action: 'SDUI_VERSION_PUBLISH', entity: 'app_configurations', id_val: 'v2.0.0', ip: '103.114.98.22', time: '1 hour ago' },
  { id: '4', user: 'accountant@dhakapremier.edu.bd', action: 'FEE_INVOICE_GENERATE', entity: 'student_fees', id_val: 'INV-FEB-26', ip: '27.147.202.14', time: '2 hours ago' },
  { id: '5', user: 'system_webhook', action: 'PAYMENT_VERIFIED', entity: 'payment_transactions', id_val: 'BKASH-98124', ip: '18.141.22.88', time: '3 hours ago' },
];

export default function SecurityAndSettingsPage() {
  const [logs, setLogs] = useState(mockAuditLogs);

  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader title="Platform Security & System Health" subtitle="Database integrity, audit logs, and infrastructure monitoring" />

      <main className="p-8 space-y-8 flex-1 overflow-y-auto">
        {/* System Health Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PostgreSQL Database</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Connected & Healthy
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Pool: 45 / 100 active connections</p>
              <p>Row Level Security: Enforced on all tables</p>
            </div>
          </div>

          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cloud Storage Buckets</span>
              <HardDrive className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              6 Buckets Active
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Total Assets: 142.8 GB / 1 TB</p>
              <p>Allowed MIME types validated</p>
            </div>
          </div>

          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Edge Functions</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              pay-verify & sdui-config
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Average Latency: 48ms</p>
              <p>Zero unhandled errors in 24h</p>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Immutable Platform Audit Logs</h3>
              <p className="text-xs text-slate-400">Security event trail tracking all administrative actions</p>
            </div>
            <button
              onClick={() => alert('Audit logs synced with real-time stream.')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="pb-3 font-semibold">User / Operator</th>
                <th className="pb-3 font-semibold">Action Triggered</th>
                <th className="pb-3 font-semibold">Target Entity</th>
                <th className="pb-3 font-semibold">Target ID</th>
                <th className="pb-3 font-semibold">Client IP</th>
                <th className="pb-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-medium text-slate-200">{log.user}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-400">{log.entity}</td>
                  <td className="py-3 font-mono text-slate-300">{log.id_val}</td>
                  <td className="py-3 font-mono text-slate-400">{log.ip}</td>
                  <td className="py-3 text-right text-slate-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
