'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Calendar,
  Clock,
  Award,
  CreditCard,
  CheckCircle2,
  BookOpen,
  LogOut,
  Bell,
  ArrowRight,
  Receipt,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'results' | 'fees'>('overview');

  return (
    <div className="min-h-screen bg-[#F3F6FB] text-slate-800 font-sans flex flex-col">
      {/* TOP INSTITUTION NAVBAR (Screenshot 4) */}
      <header className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#102A56] to-blue-600 flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-[#102A56] leading-tight">
              Green Hill International School
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Student Web Portal • Role-Based Scoped
            </p>
          </div>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">Arif Hossain</p>
            <p className="text-[10px] text-slate-500">Class 10 • Section A (Roll: 01)</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-blue-500/20">
            AH
          </div>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-6">
        {/* BLUE HERO CARD WITH TABS (Screenshot 4) */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Assigned Roll #01 • Verified Student Access</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">Assalamu Alaikum, Arif Hossain!</h2>
            <p className="text-xs text-blue-100 font-medium">
              Student ID: GHIS-2024-1001 • Class: Class 10 (Section A) • Session: 2024 - 2025
            </p>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              My Overview
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'timetable'
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              Class Timetable
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'results'
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              Exam Results & GPA
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'fees'
                  ? 'bg-white text-blue-700 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              Fee Invoices & bKash
            </button>
          </div>
        </div>

        {/* 2x2 MAIN DASHBOARD GRID (Screenshot 4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: EXAM & TODAY'S CLASSES */}
          <div className="md:col-span-2 space-y-6">
            {/* UPCOMING ACADEMIC ASSESSMENT */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white rounded-2xl p-6 shadow-md space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                UPCOMING ACADEMIC ASSESSMENT
              </p>
              <h3 className="text-xl font-black">Mid Term Examination 2025</h3>
              <p className="text-xs text-blue-100">
                Admit Card issued for Roll #01 • Starts from 15 March 2025
              </p>
            </div>

            {/* TODAY'S CLASSES (CLASS 10) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-slate-800">Today&apos;s Classes (Class 10)</h4>

              <div className="space-y-3">
                {/* Bangla */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-9 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Bangla (BAN-101)</p>
                      <p className="text-[11px] text-slate-500">Faculty: Shamsun Nahar • Room 301</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    09:00 AM - 09:45 AM
                  </span>
                </div>

                {/* English */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-9 rounded-full bg-emerald-500"></div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">English (ENG-102)</p>
                      <p className="text-[11px] text-slate-500">Faculty: Anisur Rahman • Room 301</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    09:45 AM - 10:30 AM
                  </span>
                </div>

                {/* Mathematics */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-9 rounded-full bg-amber-500"></div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Mathematics (MAT-103)</p>
                      <p className="text-[11px] text-slate-500">Faculty: Anisur Rahman • Room 301</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    10:45 AM - 11:30 AM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: ATTENDANCE & FEE STATUS */}
          <div className="space-y-6">
            {/* ATTENDANCE RECORD (ROLL #01) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
              <p className="text-xs font-bold text-slate-600">Attendance Record (Roll #01)</p>
              <p className="text-5xl font-black text-emerald-600 tracking-tight">98.5%</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Present Today</span>
              </div>
            </div>

            {/* FEE STATUS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <p className="text-xs font-bold text-slate-600">Fee Status</p>
              <p className="text-[11px] text-slate-500">Current Term Invoices:</p>
              <p className="text-2xl font-black text-emerald-600">৳ 0 Due (All Settled)</p>

              <div className="pt-2">
                <Link
                  href="#receipts"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                >
                  <span>View Receipts & Payment History</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
