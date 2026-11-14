'use client';

import React, { useState, useEffect } from 'react';
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
  UserPlus,
  X,
  CheckCircle2,
  Lock,
  Phone,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'School Admin' | 'Principal' | 'Teacher' | 'Student' | 'Parent' | 'Staff';
  schoolName: string;
  status: 'active' | 'suspended';
  lastLogin: string;
  details?: string;
}

const initialUsers: UserRecord[] = [
  {
    id: 'u-super',
    name: 'Sohel Shariar',
    email: 'Sohel229229@gmail.com',
    role: 'Super Admin',
    schoolName: 'Platform Global Executive',
    status: 'active',
    lastLogin: 'Active Now',
    details: 'Master Platform Super Administrator with unlimited ecosystem privileges',
  },
  {
    id: 'u-1',
    name: 'Dr. Tariqul Islam',
    email: 'admin@dpis.edu.bd',
    role: 'School Admin',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: '10 mins ago',
    details: 'Head of Campus Operations',
  },
  {
    id: 'u-2',
    name: 'Prof. Abdur Rahim',
    email: 'teacher@dpis.edu.bd',
    role: 'Teacher',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: '2 hours ago',
    details: 'Department of Science • Physics & Math',
  },
  {
    id: 'u-3',
    name: 'Mohammad Kamal',
    email: 'parent@dpis.edu.bd',
    role: 'Parent',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: 'Yesterday',
    details: 'Guardian of Tanvir Ahmed & Sadia Ahmed',
  },
  {
    id: 'u-4',
    name: 'Tanvir Ahmed',
    email: 'student@dpis.edu.bd',
    role: 'Student',
    schoolName: 'Dhaka Premier International School',
    status: 'active',
    lastLogin: '35 mins ago',
    details: 'Class 10 - Section A • Roll: 1001',
  },
];

const availableSchools = [
  'Dhaka Premier International School',
  'Chittagong Model College',
  'Sylhet Global Academy',
];

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          const mapped: UserRecord[] = data.users.map((u: any) => ({
            id: u.id,
            name: u.fullName,
            email: u.email,
            role:
              u.role === 'super_admin'
                ? 'Super Admin'
                : u.role === 'school_admin'
                ? 'School Admin'
                : u.role.charAt(0).toUpperCase() + u.role.slice(1),
            schoolName: u.schoolName,
            status: u.status,
            lastLogin: u.role === 'super_admin' ? 'Active Now' : 'Recently',
            details:
              u.studentClass && u.studentSection
                ? `${u.studentClass} - ${u.studentSection} • Roll: ${u.rollNumber || 'Auto'}`
                : u.department
                ? `Department of ${u.department}`
                : `${u.role} Access`,
          }));
          setUsers(mapped);
        }
      })
      .catch((err) => console.log('Notice: using initial user state', err));
  }, []);

  // Form state for creating user
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'Student' | 'Teacher' | 'Parent' | 'School Admin' | 'Staff'>('Student');
  const [newSchool, setNewSchool] = useState(availableSchools[0]);
  const [newClass, setNewClass] = useState('Class 10');
  const [newSection, setNewSection] = useState('Section A');
  const [newRoll, setNewRoll] = useState('');
  const [newDept, setNewDept] = useState('Science');
  const [newLinkedChild, setNewLinkedChild] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newFullName || !newEmail || !newPassword) {
      alert('Please fill out Name, Email, and Password');
      return;
    }

    let details = '';
    if (newRole === 'Student') {
      details = `${newClass} - ${newSection} • Roll: ${newRoll || 'Auto-Assigned'}`;
    } else if (newRole === 'Teacher') {
      details = `Department of ${newDept}`;
    } else if (newRole === 'Parent') {
      details = `Guardian of ${newLinkedChild || 'Student'}`;
    } else {
      details = `${newRole} Management Rights`;
    }

    const newUser: UserRecord = {
      id: `u-${Date.now()}`,
      name: newFullName,
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      schoolName: newSchool,
      status: 'active',
      lastLogin: 'Never (Newly Created)',
      details,
    };

    const mappedRole =
      newRole === 'School Admin'
        ? 'school_admin'
        : (newRole.toLowerCase() as any);

    // Persist to Shared Database API
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: newFullName,
        email: newEmail,
        password: newPassword,
        role: mappedRole,
        schoolName: newSchool,
        studentClass: newRole === 'Student' ? newClass : undefined,
        studentSection: newRole === 'Student' ? newSection : undefined,
        rollNumber: newRole === 'Student' ? newRoll : undefined,
        guardianName: newRole === 'Student' ? newLinkedChild : undefined,
        department: newRole === 'Teacher' ? newDept : undefined,
      }),
    }).catch((err) => console.error('Failed to sync user with server:', err));

    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);

    // Reset Form
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    setNewRoll('');
    setNewLinkedChild('');

    showToast(`🟢 New ${newRole} account created for ${newFullName} (${newEmail})! They can now log in with their credentials.`);
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.schoolName.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (id: string, name: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const next = u.status === 'active' ? 'suspended' : 'active';
          showToast(`Account for ${name} has been ${next.toUpperCase()}!`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const resetPassword = (email: string) => {
    showToast(`🔑 Password reset link dispatched to ${email}.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#070D1E] text-slate-100 min-h-screen">
      <AdminHeader
        title="Platform User Directory & Role-Based Access"
        subtitle="Super Admin master control center: Create, manage, and assign role-based credentials across all campus tenants."
      />

      <main className="p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-500/10 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400/70 hover:text-emerald-300 text-xs uppercase tracking-wider font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Super Admin Status Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 text-lg">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white">Sohel Shariar</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SUPER ADMIN
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">Sohel229229@gmail.com • Unlimited Platform Authority</div>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            Create User Account
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D152F] border border-slate-800 p-4 rounded-2xl">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user by name, email, campus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#080E21] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#080E21] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="School Admin">School Admins</option>
              <option value="Teacher">Teachers</option>
              <option value="Student">Students</option>
              <option value="Parent">Parents</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <span className="font-bold text-white">{filtered.length}</span> platform users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0D152F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0A1024] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">User Details</th>
                  <th className="py-4 px-5">Role</th>
                  <th className="py-4 px-5">Campus Tenant</th>
                  <th className="py-4 px-5">Specifics / Roll</th>
                  <th className="py-4 px-5">Account Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-[#111C3D]/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          user.role === 'Super Admin'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : user.role === 'School Admin'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                            : user.role === 'Teacher'
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
                            : user.role === 'Parent'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}>
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{user.name}</div>
                          <div className="text-slate-400 flex items-center gap-1 mt-0.5 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === 'Super Admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : user.role === 'School Admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : user.role === 'Teacher'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : user.role === 'Parent'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-medium text-slate-200">{user.schoolName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Last login: {user.lastLogin}</div>
                    </td>

                    <td className="py-4 px-5 text-slate-300 text-[11px]">
                      {user.details || '—'}
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {user.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      {user.role !== 'Super Admin' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => resetPassword(user.email)}
                            title="Reset Password"
                            className="p-1.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user.id, user.name)}
                            title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              user.status === 'active'
                                ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CREATE USER MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0D152F] border border-slate-800 rounded-3xl p-6 lg:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Create New User Account</h3>
                    <p className="text-xs text-slate-400">Assign role credentials and campus access rights.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Select Account Role *</label>
                  <div className="grid grid-cols-5 gap-2 text-xs font-semibold">
                    {(['Student', 'Teacher', 'Parent', 'School Admin', 'Staff'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setNewRole(r)}
                        className={`py-2 px-2 rounded-xl border text-center transition ${
                          newRole === r
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                            : 'bg-[#080E21] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campus Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Campus / School *</label>
                  <select
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    className="w-full bg-[#080E21] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {availableSchools.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shakil Ahmed"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full bg-[#080E21] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. shakil@dpis.edu.bd"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-[#080E21] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Initial Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Initial Account Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Set temporary password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#080E21] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Role Specific Fields */}
                {newRole === 'Student' && (
                  <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#080E21] border border-slate-800/80 rounded-xl">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Class</label>
                      <select
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        className="w-full bg-[#0D152F] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200"
                      >
                        {['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Section</label>
                      <select
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        className="w-full bg-[#0D152F] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200"
                      >
                        {['Section A', 'Section B', 'Section C'].map((sec) => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Roll Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 1025"
                        value={newRoll}
                        onChange={(e) => setNewRoll(e.target.value)}
                        className="w-full bg-[#0D152F] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200"
                      />
                    </div>
                  </div>
                )}

                {newRole === 'Teacher' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Department / Faculty</label>
                    <select
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full bg-[#080E21] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200"
                    >
                      {['Science', 'Mathematics', 'English', 'Social Science', 'Commerce'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                {newRole === 'Parent' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Linked Student Name & Roll</label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Ahmed (Roll 1001)"
                      value={newLinkedChild}
                      onChange={(e) => setNewLinkedChild(e.target.value)}
                      className="w-full bg-[#080E21] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Authorize & Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
