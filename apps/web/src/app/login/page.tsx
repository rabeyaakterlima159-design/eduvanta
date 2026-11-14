'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  LogIn,
  Lock,
  Mail,
  School,
  Building,
  GraduationCap,
  Shield,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('dhaka-premier');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent' | 'school_admin' | 'super_admin'>('student');
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const normalizedEmail = email.trim().toLowerCase();

      // Check Super Admin
      if (role === 'super_admin' || normalizedEmail === 'sohel229229@gmail.com') {
        if (password !== 'shariar123') {
          setErrorMsg('Invalid password for Super Admin account.');
          return;
        }
        window.location.href = '/super-admin';
        return;
      }

      if (password.length < 4) {
        setErrorMsg('Please enter a valid password.');
        return;
      }

      // If student Arif Hossain or general student portal
      if (role === 'student' || normalizedEmail.includes('arif')) {
        window.location.href = '/student/portal';
        return;
      }

      // Normal campus role routing
      window.location.href = `/portal/${selectedSchool}?role=${role}&email=${encodeURIComponent(normalizedEmail)}`;
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F8FC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 py-16">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#102A56] to-[#2563EB] flex items-center justify-center text-white font-extrabold text-2xl mx-auto shadow-md">
              E
            </div>
            <h2 className="text-2xl font-black text-[#102A56]">Welcome to EDUVANTA</h2>
            <p className="text-xs text-slate-500">Sign in to your campus or executive portal</p>
          </div>

          {/* Role selector */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
              {errorMsg}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Account Type</label>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  role === 'parent'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👨‍👩‍👧 Parent
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  role === 'teacher'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                👨‍🏫 Teacher
              </button>
              <button
                type="button"
                onClick={() => setRole('school_admin')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  role === 'school_admin'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏛️ School Admin
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setRole('super_admin');
                setEmail('Sohel229229@gmail.com');
              }}
              className={`w-full mt-2 py-2 px-3 rounded-xl border text-center transition text-xs font-bold ${
                role === 'super_admin'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              👑 Super Admin (Master Hub)
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {role !== 'super_admin' && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Campus</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full bg-[#F5F8FC] border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-semibold focus:outline-none focus:border-blue-600"
                  >
                    <option value="dhaka-premier">Dhaka Premier International School (SCH-DPIS-01)</option>
                    <option value="chittagong-model">Chittagong Model College (SCH-CMC-02)</option>
                    <option value="sylhet-academy">Sylhet Global Academy (SCH-SGA-03)</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@school.edu.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F5F8FC] border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#102A56] hover:bg-[#1a3d75] text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-950/20 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : `Enter ${role.replace('_', ' ').toUpperCase()} Portal`}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setRole('super_admin');
                window.location.href = 'http://localhost:3001';
              }}
              className="text-xs text-blue-600 hover:underline font-bold flex items-center justify-center gap-1 mx-auto"
            >
              <Shield className="w-3.5 h-3.5" />
              Super Admin Platform Console
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
