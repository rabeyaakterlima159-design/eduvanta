'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  Users,
  Search,
  Filter,
  KeyRound,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Building,
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolName: string;
  status: 'active' | 'suspended';
  lastLogin: string;
}

const mockUsers: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Dr. Tariqul Islam',
    email: 'principal@dhakapremier.edu.bd',
    role: 'Principal',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: '10 mins ago',
  },
  {
    id: 'u-2',
    name: 'Professor Nasreen Sultana',
    email: 'nasreen@dhakapremier.edu.bd',
    role: 'Teacher',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: '2 hours ago',
  },
  {
    id: 'u-3',
    name: 'Rafiqul Hassan',
    email: 'rafiq@cmc.edu.bd',
    role: 'School Admin',
    schoolName: 'Chittagong Model College',
    status: 'active',
    lastLogin: 'Yesterday',
  },
  {
    id: 'u-4',
    name: 'Tanvir Ahmed',
    email: 'tanvir.student@dhakapremier.edu.bd',
    role: 'Student',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: '35 mins ago',
  },
  {
    id: 'u-5',
    name: 'Farhana Yasmin',
    email: 'farhana.parent@gmail.com',
    role: 'Parent',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: '3 days ago',
  },
];

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.schoolName.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const next = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const resetPassword = (email: string) => {
    alert(`Secure password reset instructions dispatched to ${email}.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader title="Platform User Directory & RBAC" subtitle="Manage all users across tenant institutions" />

      <main className="p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name, email, campus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#131D38] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#131D38] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Principal">Principals</option>
              <option value="School Admin">School Admins</option>
              <option value="Teacher">Teachers</option>
              <option value="Student">Students</option>
              <option value="Parent">Parents</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="text-white font-bold">{filtered.length}</span> verified accounts
          </div>
        </div>

        <div className="bg-[#131D38] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E172E] border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-3 px-4 font-semibold">User Profile</th>
                <th className="py-3 px-4 font-semibold">Campus Tenant</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 font-semibold">Account Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{user.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {user.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      <span>{user.schoolName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px]">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">{user.lastLogin}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        user.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => resetPassword(user.email)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition inline-flex items-center gap-1"
                    >
                      <KeyRound className="w-3 h-3 text-amber-400" />
                      Reset Pass
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded transition ${
                        user.status === 'active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {user.status === 'active' ? 'Suspend' : 'Unsuspend'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
