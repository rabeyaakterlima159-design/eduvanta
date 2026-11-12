'use client';

import React from 'react';
import { Search, Bell, ShieldCheck, Activity, Globe } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B132B]/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campuses, users, logs..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Health status badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-400 font-medium">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Ecosystem Healthy</span>
        </div>

        {/* Notifications */}
        <button
          onClick={() => alert('Platform Notifications: No critical alerts.')}
          className="relative p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition border border-slate-700/50"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5" />
        </button>

        {/* Public Portal Shortcut */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-semibold transition"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Portal</span>
        </a>
      </div>
    </header>
  );
}
