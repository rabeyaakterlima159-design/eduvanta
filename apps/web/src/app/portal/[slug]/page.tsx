'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeePaymentModal from '@/components/FeePaymentModal';
import {
  GraduationCap,
  Users,
  Calendar,
  Award,
  FileText,
  CreditCard,
  Book,
  Bus,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Plus,
  Save,
  Search,
  Building2,
  ChevronRight,
  Shield,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface StudentAttendanceItem {
  id: string;
  name: string;
  roll: string;
  status: 'present' | 'absent' | 'late';
}

const initialClassStudents: StudentAttendanceItem[] = [
  { id: 'st-1', name: 'Tanvir Ahmed', roll: '1001', status: 'present' },
  { id: 'st-2', name: 'Ayesha Siddiqua', roll: '1002', status: 'present' },
  { id: 'st-3', name: 'Zubair Hossain', roll: '1003', status: 'present' },
  { id: 'st-4', name: 'Fatima Zahra', roll: '1004', status: 'absent' },
  { id: 'st-5', name: 'Mehedi Hasan', roll: '1005', status: 'present' },
];

export default function TenantSchoolPortalPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { role?: string };
}) {
  const [role, setRole] = useState<'student' | 'parent' | 'teacher' | 'school_admin'>(
    (searchParams.role as any) || 'student'
  );

  // Active module tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Attendance state for teacher
  const [attendanceList, setAttendanceList] = useState(initialClassStudents);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Fee Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [feeStatus, setFeeStatus] = useState<'due' | 'paid'>('due');

  const toggleStudentAttendance = (id: string) => {
    setAttendanceList(
      attendanceList.map((s) => {
        if (s.id === id) {
          const next = s.status === 'present' ? 'absent' : 'present';
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F8FC]">
      <Navbar />

      {/* Campus Portal Header */}
      <div className="bg-[#102A56] text-white py-6 border-b border-blue-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl text-amber-400 border border-white/20">
              DP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight">Dhaka Premier International School</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  SCH-DPIS-01
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                Academic Session 2026-2027 • Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* Interactive Role Switcher */}
          <div className="bg-[#0B1D3D] p-1.5 rounded-xl border border-white/10 flex items-center gap-1 self-start md:self-auto text-xs font-bold">
            <span className="text-[10px] text-blue-300 px-2 uppercase tracking-wider">Viewing As:</span>
            <button
              onClick={() => {
                setRole('student');
                setActiveTab('overview');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                role === 'student' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🎓 Student
            </button>
            <button
              onClick={() => {
                setRole('parent');
                setActiveTab('overview');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                role === 'parent' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              👨‍👩‍👧 Parent
            </button>
            <button
              onClick={() => {
                setRole('teacher');
                setActiveTab('overview');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                role === 'teacher' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              👨‍🏫 Teacher
            </button>
            <button
              onClick={() => {
                setRole('school_admin');
                setActiveTab('overview');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                role === 'school_admin' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              🏛️ School Admin
            </button>
          </div>
        </div>
      </div>

      {/* Portal Main Workspace */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* ==================================================================== */}
        {/* ROLE 1: STUDENT VIEW                                                */}
        {/* ==================================================================== */}
        {role === 'student' && (
          <div className="space-y-6">
            {/* Top Quick Stats Grid (Matching Banner Mockup!) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Attendance</span>
                  <div className="text-2xl font-black text-slate-900">95%</div>
                  <span className="text-[10px] text-emerald-600 font-bold">114 / 120 Days</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Assignments</span>
                  <div className="text-2xl font-black text-slate-900">12 Due</div>
                  <span className="text-[10px] text-purple-600 font-bold">2 Pending Submission</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Latest Results</span>
                  <div className="text-2xl font-black text-slate-900">88%</div>
                  <span className="text-[10px] text-emerald-600 font-bold">GPA 5.0 (A+)</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Tuition Fee</span>
                  <div className="text-2xl font-black text-slate-900">
                    {feeStatus === 'due' ? '৳12,500' : '৳0 Paid'}
                  </div>
                  {feeStatus === 'due' ? (
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="text-[10px] text-blue-600 hover:text-blue-700 font-bold underline"
                    >
                      Pay Online (bKash) →
                    </button>
                  ) : (
                    <span className="text-[10px] text-emerald-600 font-bold">Cleared (Receipt Issued)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
              {[
                { id: 'overview', label: 'Dashboard & Timetable' },
                { id: 'attendance', label: 'Attendance Records' },
                { id: 'exams', label: 'Examinations & Report Card' },
                { id: 'assignments', label: 'Homework & Submissions' },
                { id: 'fees', label: 'Fee Payments & Receipts' },
                { id: 'library', label: 'Library & Transport' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-4 transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview (Timetable + Notices) */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timetable (2 cols) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Today's Academic Schedule</h3>
                      <p className="text-xs text-slate-500">Class 10 - Section A (Science)</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      Thursday
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { time: '08:30 AM - 09:20 AM', subject: 'Higher Mathematics', teacher: 'Prof. Nasreen Sultana', room: 'Room 301', status: 'Completed' },
                      { time: '09:25 AM - 10:15 AM', subject: 'Physics', teacher: 'Dr. Rafiqul Hassan', room: 'Physics Lab', status: 'Ongoing' },
                      { time: '10:20 AM - 11:10 AM', subject: 'Chemistry', teacher: 'Dr. Kamal Hossain', room: 'Chemistry Lab', status: 'Upcoming' },
                      { time: '11:15 AM - 12:00 PM', subject: 'English Literature', teacher: 'Ms. Sharmin Akter', room: 'Room 301', status: 'Upcoming' },
                    ].map((period, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 transition flex items-center justify-between text-xs bg-slate-50/50"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-slate-900 text-sm">{period.subject}</div>
                          <div className="text-slate-500 flex items-center gap-2">
                            <span>{period.teacher}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-600">{period.room}</span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="font-mono text-slate-500 block">{period.time}</span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              period.status === 'Ongoing'
                                ? 'bg-emerald-100 text-emerald-700'
                                : period.status === 'Completed'
                                ? 'bg-slate-200 text-slate-600'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {period.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notices (1 col) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-900">Recent Campus Notices</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-blue-900">Annual Sports Day 2026</div>
                      <p className="text-slate-600 text-[11px]">
                        Track & field events scheduled for next Friday at the main campus ground.
                      </p>
                      <span className="text-[10px] text-blue-600 font-semibold">Nov 20, 2026</span>
                    </div>

                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-amber-900">Mid-Term Examination Schedule</div>
                      <p className="text-slate-600 text-[11px]">
                        Admit cards will be available in the portal after tuition fee clearance.
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold">Nov 18, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Fees */}
            {activeTab === 'fees' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Student Tuition Fees & Invoices</h3>
                    <p className="text-xs text-slate-500">Official billing and verified digital receipts</p>
                  </div>
                  {feeStatus === 'due' && (
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="px-5 py-2.5 bg-[#102A56] hover:bg-[#1a3d75] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay ৳12,500 Online
                    </button>
                  )}
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="pb-3 font-bold">Invoice Number</th>
                      <th className="pb-3 font-bold">Fee Description</th>
                      <th className="pb-3 font-bold">Due Date</th>
                      <th className="pb-3 font-bold">Total Amount</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 font-mono text-blue-600 font-bold">INV-DPIS-2026-001</td>
                      <td className="py-3.5 font-semibold text-slate-800">November 2026 Tuition & Lab Charges</td>
                      <td className="py-3.5 text-slate-500">2026-11-25</td>
                      <td className="py-3.5 font-black text-slate-900">৳12,500</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            feeStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {feeStatus === 'paid' ? 'PAID' : 'UNPAID'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {feeStatus === 'paid' ? (
                          <button
                            onClick={() => alert('Downloading official digital receipt PDF...')}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" /> Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="text-blue-600 hover:underline font-bold"
                          >
                            Pay with bKash
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE 2: TEACHER VIEW                                                */}
        {/* ==================================================================== */}
        {role === 'teacher' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Teacher Academic Workspace</h2>
                <p className="text-xs text-slate-500">
                  Prof. Nasreen Sultana • Department of Mathematics & Science
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg">
                Class Teacher: Grade 10 Science
              </span>
            </div>

            {/* Bulk Attendance Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Daily Attendance Marker</h3>
                  <p className="text-xs text-slate-500">Class 10 - Section A • Today: {new Date().toLocaleDateString()}</p>
                </div>

                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {attendanceSaved ? 'Saved to Supabase!' : 'Submit Attendance'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="pb-3 font-bold">Roll No</th>
                      <th className="pb-3 font-bold">Student Name</th>
                      <th className="pb-3 font-bold">Attendance Status</th>
                      <th className="pb-3 font-bold text-right">Quick Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceList.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono font-bold text-slate-700">{st.roll}</td>
                        <td className="py-3 font-bold text-slate-900">{st.name}</td>
                        <td className="py-3">
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                              st.status === 'present'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {st.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => toggleStudentAttendance(st.id)}
                            className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition"
                          >
                            Mark {st.status === 'present' ? 'Absent' : 'Present'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE 3: PARENT VIEW                                                 */}
        {/* ==================================================================== */}
        {role === 'parent' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Parent Child Care Hub</h2>
                <p className="text-xs text-slate-500">Guardian: Farhana Yasmin (Linked: 1 Child)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Active Student:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-lg">
                  Tanvir Ahmed (Class 10)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-semibold">Attendance Record</span>
                <div className="text-3xl font-black text-emerald-600">95%</div>
                <p className="text-xs text-slate-600">
                  Tanvir was marked <span className="font-bold text-emerald-600">Present</span> for today's classes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-semibold">Outstanding Fees</span>
                <div className="text-3xl font-black text-amber-600">
                  {feeStatus === 'due' ? '৳12,500' : '৳0'}
                </div>
                {feeStatus === 'due' ? (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold underline block"
                  >
                    Clear Dues with bKash / Cards →
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 font-bold">All dues cleared</span>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-semibold">Recent Term GPA</span>
                <div className="text-3xl font-black text-blue-600">5.0 / 5.0</div>
                <p className="text-xs text-slate-600">
                  Class Rank: <span className="font-bold text-slate-800">#2 out of 40</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE 4: SCHOOL ADMIN VIEW                                           */}
        {/* ==================================================================== */}
        {role === 'school_admin' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">Campus Administrator Portal</h2>
                <p className="text-xs text-slate-500">Dhaka Premier International School Administration</p>
              </div>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-lg">
                Pro Campus License Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold">Total Students</span>
                <div className="text-2xl font-black text-slate-900">1,840</div>
                <span className="text-[10px] text-emerald-600 font-bold">42 Sections Active</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold">Faculty Staff</span>
                <div className="text-2xl font-black text-slate-900">112</div>
                <span className="text-[10px] text-blue-600 font-bold">Full-Time Educators</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold">Month Fee Collection</span>
                <div className="text-2xl font-black text-slate-900">৳2.1M</div>
                <span className="text-[10px] text-emerald-600 font-bold">92% Collected</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-xs text-slate-500 font-semibold">Today's Presence</span>
                <div className="text-2xl font-black text-slate-900">96.4%</div>
                <span className="text-[10px] text-emerald-600 font-bold">Normal Attendance</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bangladesh Payment Modal */}
      <FeePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={{
          id: 'inv-1',
          invoiceNumber: 'INV-DPIS-2026-001',
          title: 'November 2026 Tuition & Lab Charges',
          studentName: 'Tanvir Ahmed',
          amount: 12500,
          balanceDue: 12500,
        }}
        onSuccess={(receipt) => {
          setFeeStatus('paid');
          alert(`Official Receipt ${receipt} generated and archived in Supabase database!`);
        }}
      />

      <Footer />
    </div>
  );
}
