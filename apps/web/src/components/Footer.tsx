import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#102A56] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-extrabold text-white text-base">
              E
            </div>
            <span className="text-xl font-black tracking-wider text-white">EDUVANTA</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            One Platform. Every Campus. Smarter Education. Complete multi-tenant educational ecosystem with Server-Driven UI and real-time campus operations.
          </p>
          <div className="text-[11px] font-semibold text-amber-400">
            SMARTER CAMPUS • BRIGHTER FUTURE
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-4">
            Ecosystem Portals
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <Link href="/portal/dhaka-premier?role=student" className="hover:text-white transition">
                Student Portal
              </Link>
            </li>
            <li>
              <Link href="/portal/dhaka-premier?role=parent" className="hover:text-white transition">
                Parent Portal
              </Link>
            </li>
            <li>
              <Link href="/portal/dhaka-premier?role=teacher" className="hover:text-white transition">
                Teacher & Grading Portal
              </Link>
            </li>
            <li>
              <Link href="/portal/dhaka-premier?role=school_admin" className="hover:text-white transition">
                School Administrator Hub
              </Link>
            </li>
            <li>
              <a href="http://localhost:3001" target="_blank" rel="noreferrer" className="hover:text-white transition">
                Super Admin Console
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-4">
            Enterprise SaaS
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>Multi-Tenant Isolation</li>
            <li>Row Level Security (RLS)</li>
            <li>Server-Driven UI (SDUI)</li>
            <li>bKash / Nagad / SSLCommerz</li>
            <li>Firebase Cloud Messaging (FCM)</li>
            <li>Biometric Hardware Sync</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-4">
            Headquarters & Support
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            EDUVANTA Technologies Ltd.<br />
            Level 14, Silicon Center, Gulshan-2<br />
            Dhaka-1212, Bangladesh
          </p>
          <p className="text-xs text-slate-300">
            Support: <span className="text-white font-mono">+880 9612 000 000</span>
          </p>
          <p className="text-xs text-slate-300">
            Email: <span className="text-white font-mono">contact@eduvanta.com</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
        <div>
          © {new Date().getFullYear()} EDUVANTA Smart Campus Management Ecosystem. All rights reserved.
        </div>
        <div className="flex gap-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security Whitepaper</span>
        </div>
      </div>
    </footer>
  );
}
