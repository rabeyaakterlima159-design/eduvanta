'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  DollarSign,
  PhoneCall,
  LogIn,
} from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#102A56] to-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-900/20 text-white font-extrabold text-xl">
            E
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider text-[#102A56]">
              EDUVANTA
            </span>
            <span className="block text-[10px] font-bold tracking-widest text-[#2563EB] uppercase -mt-1">
              Smart Campus
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#roles" className="hover:text-blue-600 transition">
            Ecosystem Roles
          </a>
          <a href="#sdui" className="hover:text-blue-600 transition flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Server-Driven UI
          </a>
          <a href="#pricing" className="hover:text-blue-600 transition">
            Pricing Plans
          </a>
          <a href="#faq" className="hover:text-blue-600 transition">
            FAQ
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Super Admin
          </a>

          <Link
            href="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#102A56] hover:bg-[#1a3d75] text-white text-xs font-bold rounded-lg shadow-md shadow-blue-950/20 transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            Portal Login
          </Link>
        </div>
      </div>
    </header>
  );
}
