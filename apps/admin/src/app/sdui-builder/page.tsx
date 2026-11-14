'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  Sliders,
  Smartphone,
  Eye,
  RotateCcw,
  UploadCloud,
  Check,
  MoveUp,
  MoveDown,
  Layers,
  Palette,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  CreditCard,
  Bell,
  GraduationCap,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface SDUIWidget {
  id: string;
  type: string;
  title: string;
  visible: boolean;
  order: number;
  props: Record<string, any>;
}

const initialWidgets: SDUIWidget[] = [
  {
    id: 'hero_banner',
    type: 'HeroBanner',
    title: 'Welcome to Eduvanta',
    visible: true,
    order: 1,
    props: {
      tagline: 'Learn • Grow • Excel',
      ctaLabel: 'Explore More',
      ctaRoute: '/notices',
    },
  },
  {
    id: 'quick_stats',
    type: 'QuickStats',
    title: 'Student Overview',
    visible: true,
    order: 2,
    props: {
      attendance: '95%',
      assignments: '12 Due',
      results: '88% GPA 5.0',
      feesDue: '৳12,500',
    },
  },
  {
    id: 'action_grid',
    type: 'ActionGrid',
    title: 'Quick Actions',
    visible: true,
    order: 3,
    props: {
      columns: 4,
      items: [
        { label: 'My Classes', icon: 'BookOpen', color: '#2563EB' },
        { label: 'Attendance', icon: 'Calendar', color: '#F59E0B' },
        { label: 'Results', icon: 'Award', color: '#3B82F6' },
        { label: 'Assignments', icon: 'FileText', color: '#EC4899' },
        { label: 'Library', icon: 'Book', color: '#8B5CF6' },
        { label: 'Fee Status', icon: 'CreditCard', color: '#10B981' },
        { label: 'Notices', icon: 'Bell', color: '#EF4444' },
        { label: 'More', icon: 'Grid', color: '#64748B' },
      ],
    },
  },
  {
    id: 'upcoming_events',
    type: 'AnnouncementFeed',
    title: 'Upcoming Events & Notices',
    visible: true,
    order: 4,
    props: {
      notices: [
        { title: 'Annual Sports Day 2026', date: 'Nov 20, 2026' },
        { title: 'Mid-Term Exam Schedule', date: 'Nov 18, 2026' },
      ],
    },
  },
];

export default function SDUIBuilderPage() {
  const [version, setVersion] = useState(2);
  const [themePrimary, setThemePrimary] = useState('#102A56');
  const [themeSecondary, setThemeSecondary] = useState('#2563EB');
  const [themeAccent, setThemeAccent] = useState('#F5B82E');
  const [appBarTitle, setAppBarTitle] = useState('EDUVANTA');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('Scheduled system maintenance in progress. Back shortly.');
  const [minAppVersion, setMinAppVersion] = useState('1.0.0');
  const [widgets, setWidgets] = useState<SDUIWidget[]>(initialWidgets);
  const [activeTab, setActiveTab] = useState<'widgets' | 'theme' | 'maintenance'>('widgets');
  const [isSaved, setIsSaved] = useState(false);

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(
      widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= widgets.length) return;

    const newWidgets = [...widgets];
    const temp = newWidgets[index];
    newWidgets[index] = newWidgets[targetIndex];
    newWidgets[targetIndex] = temp;
    // update order
    newWidgets.forEach((w, idx) => {
      w.order = idx + 1;
    });
    setWidgets(newWidgets);
  };

  const handlePublish = () => {
    const nextVer = version + 1;
    setVersion(nextVer);
    setIsSaved(true);

    fetch('/api/sdui/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: nextVer,
        maintenanceMode,
        maintenanceMessage,
        theme: {
          primaryColor: themePrimary,
          secondaryColor: themeSecondary,
          accentColor: themeAccent,
          backgroundColor: '#F5F8FC',
        },
        heroBanner: {
          title: widgets.find((w) => w.id === 'hero_banner')?.title || 'Welcome to Eduvanta',
          subtitle: 'Learn • Grow • Excel',
          badge: 'Live Remote Config',
          actionText: 'Explore More',
          actionUrl: '/notices',
        },
      }),
    }).catch((err) => console.error('Failed to sync SDUI config:', err));

    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRollback = () => {
    if (version <= 1) {
      alert('Already at base initial configuration version 1.');
      return;
    }
    setVersion(1);
    setThemePrimary('#102A56');
    setThemeSecondary('#2563EB');
    setThemeAccent('#F5B82E');
    setAppBarTitle('EDUVANTA');
    setMaintenanceMode(false);
    alert('Rolled back successfully to Version 1 snapshot.');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader
        title="Server-Driven UI (SDUI) & Remote Config Engine"
        subtitle="Manage dynamic mobile and web campus layouts, themes, and version control in real-time"
      />

      <main className="p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">
        {/* Left Side: Controls & Builder Tabs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Action & Version Pill */}
          <div className="flex items-center justify-between bg-[#131D38] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-xs text-slate-400 font-medium">Live Configuration</span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  v{version}.0.0 Active
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-mono">
                    Published
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRollback}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Rollback
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <UploadCloud className="w-3.5 h-3.5" />}
                {isSaved ? 'Published Live!' : 'Publish Version'}
              </button>
            </div>
          </div>

          {/* Builder Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('widgets')}
              className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 ${
                activeTab === 'widgets'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Dashboard Widgets & Order
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 ${
                activeTab === 'theme'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              Theme & Remote Branding
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 ${
                activeTab === 'maintenance'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Maintenance & Version Policy
            </button>
          </div>

          {/* Tab 1: Widgets & Reordering */}
          {activeTab === 'widgets' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Configure safe runtime components rendered by mobile & web clients:</span>
                <span className="text-[11px] font-mono text-emerald-400">Strict SDUI Registry Enforced</span>
              </div>

              {widgets.map((widget, idx) => (
                <div
                  key={widget.id}
                  className={`bg-[#131D38] border rounded-xl p-4 transition flex items-center justify-between gap-4 ${
                    widget.visible ? 'border-slate-800' : 'border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{widget.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Type: <span className="text-blue-400">{widget.type}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                        widget.visible
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {widget.visible ? 'Visible' : 'Hidden'}
                    </button>

                    <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveWidget(idx, 'up')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === widgets.length - 1}
                        onClick={() => moveWidget(idx, 'down')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Theme Settings */}
          {activeTab === 'theme' && (
            <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6 space-y-5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Global App Bar Title</label>
                <input
                  type="text"
                  value={appBarTitle}
                  onChange={(e) => setAppBarTitle(e.target.value)}
                  className="w-full bg-[#0E172E] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Navy Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themePrimary}
                      onChange={(e) => setThemePrimary(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-slate-700 bg-transparent"
                    />
                    <input
                      type="text"
                      value={themePrimary}
                      onChange={(e) => setThemePrimary(e.target.value)}
                      className="flex-1 bg-[#0E172E] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Royal Blue Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSecondary}
                      onChange={(e) => setThemeSecondary(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-slate-700 bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeSecondary}
                      onChange={(e) => setThemeSecondary(e.target.value)}
                      className="flex-1 bg-[#0E172E] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Gold Badge Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeAccent}
                      onChange={(e) => setThemeAccent(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-slate-700 bg-transparent"
                    />
                    <input
                      type="text"
                      value={themeAccent}
                      onChange={(e) => setThemeAccent(e.target.value)}
                      className="flex-1 bg-[#0E172E] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Maintenance & Version Policy */}
          {activeTab === 'maintenance' && (
            <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6 space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Emergency Maintenance Mode</h4>
                  <p className="text-slate-400">Lock client access for scheduled migrations or maintenance</p>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                    maintenanceMode ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {maintenanceMode && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Maintenance Notice Message</label>
                  <textarea
                    rows={2}
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    className="w-full bg-[#0E172E] border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div className="pt-2">
                <label className="block text-slate-300 font-semibold mb-1">Minimum Supported Client Version</label>
                <input
                  type="text"
                  value={minAppVersion}
                  onChange={(e) => setMinAppVersion(e.target.value)}
                  className="w-48 bg-[#0E172E] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Apps with an older version will display a mandatory update modal before granting access.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Interactive Mobile Phone Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-blue-400" />
            Live Client Render Preview (Flutter & Web SDUI)
          </div>

          {/* Smartphone Frame */}
          <div className="w-[320px] h-[640px] bg-slate-900 border-[8px] border-slate-700 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative select-none">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-700 rounded-b-xl z-30" />

            {/* Mobile Status Bar */}
            <div
              className="pt-6 px-6 pb-2 text-[10px] text-white flex justify-between items-center z-20"
              style={{ backgroundColor: themePrimary }}
            >
              <span>9:41</span>
              <div className="flex items-center gap-1 font-semibold">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Mobile App Bar */}
            <div
              className="px-5 py-3 text-white flex justify-between items-center shadow-sm z-10 transition-colors"
              style={{ backgroundColor: themePrimary }}
            >
              <div>
                <span className="text-[10px] text-slate-300">Welcome back,</span>
                <div className="text-sm font-extrabold tracking-wide">{appBarTitle}</div>
              </div>
              <div className="p-1.5 rounded-full bg-white/10">
                <Bell className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Mobile Scrollable Body */}
            <div className="flex-1 bg-[#F5F8FC] overflow-y-auto p-4 space-y-4 text-slate-800">
              {/* Maintenance Banner Preview */}
              {maintenanceMode && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {maintenanceMessage}
                </div>
              )}

              {/* Dynamic Widgets Loop */}
              {widgets
                .filter((w) => w.visible)
                .map((widget) => {
                  if (widget.type === 'HeroBanner') {
                    return (
                      <div
                        key={widget.id}
                        className="rounded-2xl p-4 text-white shadow-md relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${themePrimary} 0%, ${themeSecondary} 100%)`,
                        }}
                      >
                        <div className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
                          Academic Session 2026-2027
                        </div>
                        <h4 className="text-base font-extrabold">{widget.title}</h4>
                        <p className="text-[11px] text-slate-200 mb-3">{widget.props.tagline}</p>
                        <button
                          className="px-3 py-1 rounded-full text-[10px] font-bold shadow transition"
                          style={{ backgroundColor: themeAccent, color: '#102A56' }}
                        >
                          {widget.props.ctaLabel}
                        </button>
                      </div>
                    );
                  }

                  if (widget.type === 'QuickStats') {
                    return (
                      <div key={widget.id} className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <span className="text-[10px] text-slate-500">Attendance</span>
                          <div className="text-sm font-extrabold text-blue-600">{widget.props.attendance}</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <span className="text-[10px] text-slate-500">Assignments</span>
                          <div className="text-sm font-extrabold text-purple-600">{widget.props.assignments}</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <span className="text-[10px] text-slate-500">Results</span>
                          <div className="text-sm font-extrabold text-emerald-600">{widget.props.results}</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm">
                          <span className="text-[10px] text-slate-500">Fee Due</span>
                          <div className="text-sm font-extrabold text-amber-600">{widget.props.feesDue}</div>
                        </div>
                      </div>
                    );
                  }

                  if (widget.type === 'ActionGrid') {
                    return (
                      <div key={widget.id} className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-700">{widget.title}</span>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {widget.props.items.map((item: any) => (
                            <div
                              key={item.label}
                              className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center hover:scale-105 transition"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-1 shadow-sm"
                                style={{ backgroundColor: item.color }}
                              >
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <span className="text-[9px] font-semibold text-slate-700 truncate w-full">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (widget.type === 'AnnouncementFeed') {
                    return (
                      <div key={widget.id} className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-700">{widget.title}</span>
                        <div className="space-y-1.5">
                          {widget.props.notices.map((n: any) => (
                            <div
                              key={n.title}
                              className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-sm flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-bold text-slate-800 text-[11px]">{n.title}</p>
                                <span className="text-[9px] text-slate-400">{n.date}</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="h-14 bg-white border-t border-slate-200 flex items-center justify-around px-4 text-[10px] text-slate-500">
              <div className="flex flex-col items-center font-bold text-blue-600">
                <Smartphone className="w-4 h-4" />
                <span>Home</span>
              </div>
              <div className="flex flex-col items-center">
                <Calendar className="w-4 h-4" />
                <span>Timetable</span>
              </div>
              <div className="flex flex-col items-center">
                <Bell className="w-4 h-4" />
                <span>Notices</span>
              </div>
              <div className="flex flex-col items-center">
                <GraduationCap className="w-4 h-4" />
                <span>Profile</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
