'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  ShieldAlert,
  ArrowUpRight,
  Download,
  AlertCircle,
} from 'lucide-react';

interface AdmissionApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  schoolId: string;
  schoolName: string;
  className: string;
  section: string;
  rollNumber: string;
  guardianName: string;
  guardianPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  remarks?: string;
}

const initialApplications: AdmissionApplication[] = [
  {
    id: 'EDV-REG-2026-001',
    fullName: 'Sumon Das',
    email: 'sumon.das@gmail.com',
    phone: '+880 1711-223344',
    schoolId: '22222222-2222-2222-2222-222222222201',
    schoolName: 'Dhaka Premier International School',
    className: 'Class 10',
    section: 'Section B',
    rollNumber: '1045',
    guardianName: 'Subir Das',
    guardianPhone: '+880 1819-334455',
    status: 'pending',
    submittedAt: '2026-11-14 07:15 AM',
  },
  {
    id: 'EDV-REG-2026-002',
    fullName: 'Nafisa Tabassum',
    email: 'nafisa.tabassum@gmail.com',
    phone: '+880 1911-556677',
    schoolId: '22222222-2222-2222-2222-222222222201',
    schoolName: 'Dhaka Premier International School',
    className: 'Class 9',
    section: 'Section A',
    rollNumber: '9012',
    guardianName: 'Dr. Anwar Hossain',
    guardianPhone: '+880 1712-998877',
    status: 'pending',
    submittedAt: '2026-11-14 04:30 AM',
  },
  {
    id: 'EDV-REG-2026-003',
    fullName: 'Arifur Rahman',
    email: 'arifur.rahman@gmail.com',
    phone: '+880 1812-445566',
    schoolId: '22222222-2222-2222-2222-222222222202',
    schoolName: 'Chittagong Model College',
    className: 'Class 11',
    section: 'Section C',
    rollNumber: '1102',
    guardianName: 'Farid Rahman',
    guardianPhone: '+880 1714-223311',
    status: 'approved',
    submittedAt: '2026-11-13 11:20 AM',
    remarks: 'Approved by Super Admin on 2026-11-13',
  },
  {
    id: 'EDV-REG-2026-004',
    fullName: 'Mahmudul Hasan',
    email: 'mahmud.hasan@gmail.com',
    phone: '+880 1611-998800',
    schoolId: '22222222-2222-2222-2222-222222222203',
    schoolName: 'Sylhet Global Academy',
    className: 'Class 8',
    section: 'Section A',
    rollNumber: '8008',
    guardianName: 'Rezaul Karim',
    guardianPhone: '+880 1515-887766',
    status: 'rejected',
    submittedAt: '2026-11-12 02:45 PM',
    remarks: 'Guardian contact invalid and birth certificate missing',
  },
];

export default function AdmissionsPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = (id: string, name: string, school: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'approved', remarks: `Approved & Enrolled by Platform Admin on ${new Date().toLocaleDateString()}` }
          : app
      )
    );
    showToast(`🟢 ${name} has been APPROVED and enrolled into ${school}! Student account activated for mobile login.`);
  };

  const handleReject = (id: string, name: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'rejected', remarks: 'Application declined by administration.' }
          : app
      )
    );
    showToast(`🔴 Application for ${name} has been REJECTED.`);
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rollNumber.includes(searchTerm) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSchool = selectedSchool === 'all' || app.schoolName === selectedSchool;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesSchool && matchesStatus;
  });

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  return (
    <div className="min-slate min-h-screen bg-[#070D1E] text-slate-100 flex flex-col">
      <AdminHeader
        title="Student Admissions & Registrations"
        subtitle="Manage student account requests, verify admissions, and authorize role-based mobile access across campuses."
      />

      <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-500/10 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400/70 hover:text-emerald-300 text-xs uppercase tracking-wider font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0D152F] border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Requests</div>
              <div className="text-2xl font-black text-white mt-1">{applications.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">From Mobile & Web</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('pending')}
            className={`cursor-pointer rounded-2xl p-5 flex items-center justify-between border transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-[#0D152F] border-slate-800 hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="text-amber-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Pending Review
              </div>
              <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
              <div className="text-[11px] text-amber-300/70 mt-1">Awaiting Authorization</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('approved')}
            className={`cursor-pointer rounded-2xl p-5 flex items-center justify-between border transition-all ${
              statusFilter === 'approved'
                ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-[#0D152F] border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div>
              <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approved & Enrolled
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{approvedCount}</div>
              <div className="text-[11px] text-emerald-400/70 mt-1">Active Mobile Access</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('rejected')}
            className={`cursor-pointer rounded-2xl p-5 flex items-center justify-between border transition-all ${
              statusFilter === 'rejected'
                ? 'bg-red-500/10 border-red-500 ring-2 ring-red-500/20'
                : 'bg-[#0D152F] border-slate-800 hover:border-red-500/40'
            }`}
          >
            <div>
              <div className="text-red-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                Declined
              </div>
              <div className="text-2xl font-black text-red-400 mt-1">{rejectedCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">Incomplete / Invalid</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#0D152F] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, roll, email, or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080E21] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="bg-[#080E21] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Campuses</option>
              <option value="Dhaka Premier International School">Dhaka Premier Int'l School</option>
              <option value="Chittagong Model College">Chittagong Model College</option>
              <option value="Sylhet Global Academy">Sylhet Global Academy</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className="inline-flex rounded-xl bg-[#080E21] p-1 border border-slate-800">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => showToast('Exporting admissions roster to CSV format...')}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Admissions Roster Table */}
        <div className="bg-[#0D152F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0A1024] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">Student Information</th>
                  <th className="py-4 px-5">Campus & School</th>
                  <th className="py-4 px-5">Class & Section</th>
                  <th className="py-4 px-5">Guardian Contacts</th>
                  <th className="py-4 px-5">Applied Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No student applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-[#111C3D]/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-xs">
                            {app.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{app.fullName}</div>
                            <div className="text-slate-400 flex items-center gap-1 mt-0.5 text-[11px]">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {app.email}
                            </div>
                            <div className="text-slate-500 flex items-center gap-1 text-[10px]">
                              <Phone className="w-2.5 h-2.5" />
                              {app.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-200">{app.schoolName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{app.id}</div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-200">
                          {app.className} - {app.section}
                        </div>
                        <div className="text-[11px] text-blue-400 font-mono mt-0.5">
                          Roll: {app.rollNumber}
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <div className="text-slate-300 font-medium">{app.guardianName}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{app.guardianPhone}</div>
                      </td>

                      <td className="py-4 px-5 text-slate-400 text-[11px] whitespace-nowrap">
                        {app.submittedAt}
                      </td>

                      <td className="py-4 px-5">
                        {app.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            PENDING APPROVAL
                          </span>
                        )}
                        {app.status === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            ENROLLED & ACTIVE
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            <XCircle className="w-3 h-3" />
                            REJECTED
                          </span>
                        )}
                        {app.remarks && (
                          <div className="text-[10px] text-slate-500 mt-1 max-w-[200px] truncate" title={app.remarks}>
                            {app.remarks}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        {app.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReject(app.id, app.fullName)}
                              className="px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(app.id, app.fullName, app.schoolName)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
