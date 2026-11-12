'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  Bell,
  Send,
  Radio,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
} from 'lucide-react';

export default function NotificationsBroadcastPage() {
  const [targetScope, setTargetScope] = useState<'all' | 'school' | 'role'>('all');
  const [selectedSchool, setSelectedSchool] = useState('Dhaka Premier International School');
  const [selectedRole, setSelectedRole] = useState('student');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [dispatchedList, setDispatchedList] = useState([
    {
      id: '1',
      title: 'Platform Maintenance Completed',
      body: 'All SDUI and attendance systems operating normally.',
      target: 'Global (All 48 Campuses)',
      time: '1 hour ago',
      recipients: '12.5K devices',
    },
    {
      id: '2',
      title: 'Term Examination Schedule Published',
      body: 'First term examination schedules are now available under Examination tab.',
      target: 'Dhaka Premier (Students & Parents)',
      time: 'Yesterday',
      recipients: '2,460 devices',
    },
  ]);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) {
      alert('Please provide notification title and message body.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const newEntry = {
        id: Date.now().toString(),
        title,
        body,
        target:
          targetScope === 'all'
            ? 'Global (All 48 Campuses)'
            : targetScope === 'school'
            ? selectedSchool
            : `Role: ${selectedRole.toUpperCase()}`,
        time: 'Just now',
        recipients: targetScope === 'all' ? '12.5K devices' : '1.8K devices',
      };
      setDispatchedList([newEntry, ...dispatchedList]);
      setTitle('');
      setBody('');
      setIsSending(false);
      alert('Push notification broadcast queued and dispatched to FCM!');
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader title="Push Notification Center" subtitle="Broadcast FCM push notifications across all platforms" />

      <main className="p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">
        {/* Compose Form (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              Compose Push Broadcast
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Deliver high-priority alerts to Android, iOS, and Web devices
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
              {/* Target Scope */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetScope('all')}
                    className={`py-2 px-3 rounded-lg font-semibold transition border ${
                      targetScope === 'all'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    All Campuses
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetScope('school')}
                    className={`py-2 px-3 rounded-lg font-semibold transition border ${
                      targetScope === 'school'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Specific School
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetScope('role')}
                    className={`py-2 px-3 rounded-lg font-semibold transition border ${
                      targetScope === 'role'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Specific Role
                  </button>
                </div>
              </div>

              {targetScope === 'school' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select School</label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full bg-[#0E172E] border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Dhaka Premier International School">Dhaka Premier International School</option>
                    <option value="Chittagong Model College">Chittagong Model College</option>
                    <option value="Sylhet Global Academy">Sylhet Global Academy</option>
                  </select>
                </div>
              )}

              {targetScope === 'role' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-[#0E172E] border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="student">Students Only</option>
                    <option value="teacher">Teachers Only</option>
                    <option value="parent">Parents Only</option>
                    <option value="school_admin">School Admins</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Campus Announcement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0E172E] border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Body *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of the announcement..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-[#0E172E] border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Dispatching...' : 'Broadcast FCM Push Notification'}
              </button>
            </form>
          </div>
        </div>

        {/* History Feed (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#131D38] border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-1">Dispatched Broadcast Logs</h3>
            <p className="text-xs text-slate-400 mb-5">History of sent notifications</p>

            <div className="space-y-4">
              {dispatchedList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0E172E] border border-slate-800 rounded-xl p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-slate-300">{item.body}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-blue-400 font-medium">{item.target}</span>
                    <span className="font-mono text-emerald-400">{item.recipients}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
