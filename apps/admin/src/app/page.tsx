'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  School,
  UserPlus,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 1.2, activeCampuses: 24 },
  { month: 'Feb', revenue: 1.5, activeCampuses: 29 },
  { month: 'Mar', revenue: 1.9, activeCampuses: 35 },
  { month: 'Apr', revenue: 2.2, activeCampuses: 40 },
  { month: 'May', revenue: 2.5, activeCampuses: 44 },
  { month: 'Jun', revenue: 2.8, activeCampuses: 48 },
];

const userDistribution = [
  { name: 'Students', value: 62, color: '#3B82F6' },
  { name: 'Teachers', value: 18, color: '#10B981' },
  { name: 'Parents', value: 12, color: '#F59E0B' },
  { name: 'Staff', value: 8, color: '#8B5CF6' },
];

const recentSchools = [
  {
    id: '1',
    name: 'Dhaka Premier International School',
    code: 'SCH-DPIS-01',
    plan: 'Pro Campus',
    status: 'active',
    students: 1840,
    renewDate: '2027-01-15',
  },
  {
    id: '2',
    name: 'Chittagong Model College',
    code: 'SCH-CMC-02',
    plan: 'Basic Campus',
    status: 'active',
    students: 620,
    renewDate: '2026-08-10',
  },
  {
    id: '3',
    name: 'Sylhet Global Academy',
    code: 'SCH-SGA-03',
    plan: 'Free Starter',
    status: 'trial',
    students: 95,
    renewDate: '2026-04-01',
  },
  {
    id: '4',
    name: 'Rajshahi Scholars School',
    code: 'SCH-RSS-04',
    plan: 'Pro Campus',
    status: 'active',
    students: 1120,
    renewDate: '2026-11-20',
  },
];

const platformLogs = [
  { id: '1', action: 'New school registered', campus: 'Rajshahi Scholars School', time: '2 mins ago', badge: 'bg-emerald-500/10 text-emerald-400' },
  { id: '2', action: 'Subscription renewed (Pro Plan)', campus: 'Dhaka Premier International', time: '5 mins ago', badge: 'bg-blue-500/10 text-blue-400' },
  { id: '3', action: 'FCM push broadcast dispatched', campus: 'All Campuses (48)', time: '28 mins ago', badge: 'bg-purple-500/10 text-purple-400' },
  { id: '4', action: 'SDUI Home Layout version 2 published', campus: 'Global Android & Web', time: '1 hour ago', badge: 'bg-amber-500/10 text-amber-400' },
];

export default function AdminDashboardPage() {
  const [filterPeriod, setFilterPeriod] = useState<'7D' | '30D' | '1Y'>('30D');

  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader title="Super Admin Dashboard" subtitle="Platform Overview & SaaS Ecosystem Health" />

      <main className="p-8 space-y-8 flex-1 overflow-y-auto">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Schools */}
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Schools</span>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20 group-hover:scale-110 transition">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-white">48</div>
              <div className="flex items-center text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +12% this mo
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">45 Active • 3 In Setup</p>
          </div>

          {/* Card 2: Total Users */}
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</span>
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-white">12.5K</div>
              <div className="flex items-center text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +8.4%
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">8.2K Students • 1.1K Teachers</p>
          </div>

          {/* Card 3: Subscription Revenue */}
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subscription Revenue</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition">
                <span className="font-extrabold text-base">৳</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-white">৳2.8M</div>
              <div className="flex items-center text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +19.2%
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Annual Run Rate: ৳33.6M</p>
          </div>

          {/* Card 4: Ecosystem Health */}
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Uptime & Health</span>
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20 group-hover:scale-110 transition">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold text-white">98.7%</div>
              <div className="flex items-center text-xs font-semibold text-emerald-400">
                Optimal
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Supabase DB Latency: 22ms</p>
          </div>
        </div>

        {/* Analytics Section: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Growth Chart (2 cols) */}
          <div className="lg:col-span-2 bg-[#131D38] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Platform Growth & Revenue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Recurring SaaS subscription trajectory</p>
              </div>

              <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs font-medium">
                {(['7D', '30D', '1Y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setFilterPeriod(period)}
                    className={`px-3 py-1 rounded-md transition ${
                      filterPeriod === period
                        ? 'bg-blue-600 text-white font-semibold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="M" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`৳${value}M`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Donut (1 col) */}
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white mb-1">User Distribution</h3>
              <p className="text-xs text-slate-400">Total active accounts by role</p>
            </div>

            <div className="h-48 w-full my-auto flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-white">12.5K</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-200">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row: School Management & Recent Activity Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* School Directory Quick Table */}
          <div className="lg:col-span-2 bg-[#131D38] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white">School Management</h3>
                <p className="text-xs text-slate-400">Active campus tenants and subscription statuses</p>
              </div>
              <a
                href="/schools"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Manage All (48) <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Campus Name</th>
                    <th className="pb-3 font-semibold">Plan</th>
                    <th className="pb-3 font-semibold">Students</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentSchools.map((school) => (
                    <tr key={school.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 font-medium text-slate-200">
                        <div>{school.name}</div>
                        <span className="text-[10px] text-slate-500 font-mono">{school.code}</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                          {school.plan}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 font-semibold">{school.students.toLocaleString()}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {school.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href={`/schools?id=${school.id}`}
                          className="px-2.5 py-1 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition font-medium"
                        >
                          Inspect
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activities Feed */}
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Recent Activities</h3>
            <p className="text-xs text-slate-400 mb-4">Realtime audit events across platform</p>

            <div className="space-y-4">
              {platformLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-200">{log.action}</p>
                    <p className="text-slate-400 text-[11px] truncate">{log.campus}</p>
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <a
                href="/settings"
                className="w-full block text-center py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition"
              >
                View Full Audit Logs
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
