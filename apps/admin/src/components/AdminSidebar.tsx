'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Sliders,
  Bell,
  Settings,
  ShieldAlert,
  Headphones,
  FileSpreadsheet,
  LogOut,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Schools', href: '/schools', icon: Building2 },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { label: 'SDUI & Remote Config', href: '/sdui-builder', icon: Sliders },
  { label: 'Push Notifications', href: '/notifications', icon: Bell },
  { label: 'Audit Logs & Security', href: '/settings', icon: ShieldAlert },
  { label: 'Support Desk', href: '/support', icon: Headphones },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0A1128] border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          E
        </div>
        <div>
          <div className="font-extrabold text-lg tracking-wider text-white flex items-center gap-1.5">
            EDUVANTA
            <span className="text-[10px] uppercase tracking-widest bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">Super</span>
          </div>
          <div className="text-[11px] text-slate-400 -mt-0.5">Control Center</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Ecosystem Admin
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080D21]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-amber-400 border border-amber-500/30">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">Super Admin</div>
            <div className="text-[11px] text-slate-400 truncate">admin@eduvanta.com</div>
          </div>
        </div>
        <button
          onClick={() => {
            alert('Session logged out successfully.');
            window.location.href = '/';
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-md transition border border-rose-500/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
