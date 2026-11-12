'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  Headphones,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Building,
  User,
} from 'lucide-react';

interface Ticket {
  id: string;
  campus: string;
  creator: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  time: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TICK-101',
    campus: 'Dhaka Premier International School',
    creator: 'Dr. Tariqul Islam (Principal)',
    subject: 'Request biometric attendance hardware API integration key',
    category: 'Integration',
    priority: 'high',
    status: 'in_progress',
    time: '2 hours ago',
  },
  {
    id: 'TICK-102',
    campus: 'Chittagong Model College',
    creator: 'Rafiqul Hassan (Admin)',
    subject: 'Inquiry regarding annual subscription invoice receipt generation',
    category: 'Billing',
    priority: 'medium',
    status: 'resolved',
    time: 'Yesterday',
  },
  {
    id: 'TICK-103',
    campus: 'Sylhet Global Academy',
    creator: 'Imran Kabir (Principal)',
    subject: 'Assistance upgrading from Free Starter to Pro Campus',
    category: 'Subscription Upgrade',
    priority: 'urgent',
    status: 'open',
    time: '3 hours ago',
  },
];

export default function SupportDeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const updateTicketStatus = (id: string, newStatus: 'open' | 'in_progress' | 'resolved') => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader title="Campus Support Desk" subtitle="Triage campus leadership requests and technical inquiries" />

      <main className="p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-[#131D38] border border-slate-800 rounded-xl p-6 transition hover:border-slate-700 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-blue-400 font-bold text-sm">{ticket.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      ticket.priority === 'urgent'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : ticket.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {ticket.priority} priority
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                    {ticket.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {(['open', 'in_progress', 'resolved'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateTicketStatus(ticket.id, status)}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold capitalize transition ${
                        ticket.status === status
                          ? status === 'resolved'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1">{ticket.subject}</h4>
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-blue-400" />
                    <span>{ticket.campus}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{ticket.creator}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ticket.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
