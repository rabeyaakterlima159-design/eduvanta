'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  DollarSign,
  KeyRound,
  Shield,
  GraduationCap,
  Briefcase,
  UserCheck,
  Search,
  PlusCircle,
  ExternalLink,
  LogOut,
  Globe,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  Mail,
  Phone,
  UserPlus,
} from 'lucide-react';

interface UserItem {
  id: string;
  role: 'SUPERADMIN' | 'SCHOOL ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  roleCategory: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent';
  fullName: string;
  subtitle: string;
  assignedRollOrId: string;
  isRollBadge?: boolean;
  classDept: string;
  institution: string;
  contact: string;
  status: 'Active' | 'Suspended';
  portalUrl: string;
}

const initialUsersList: UserItem[] = [
  {
    id: 'u-1',
    role: 'SUPERADMIN',
    roleCategory: 'super_admin',
    fullName: 'Rabeya Akter Lima',
    subtitle: 'Principal Super Administrator & Platform Owner',
    assignedRollOrId: 'rabeyaakterlima159@gmail.com',
    classDept: 'Administration',
    institution: 'SIS Digital Ecosystem (Central Platform) (SIS-GLOBAL)',
    contact: 'rabeyaakterlima159@gmail.com',
    status: 'Active',
    portalUrl: '/super-admin',
  },
  {
    id: 'u-2',
    role: 'SCHOOL ADMIN',
    roleCategory: 'school_admin',
    fullName: 'Principal M. A. Karim',
    subtitle: 'Headmaster & Principal',
    assignedRollOrId: 'principal@greenhill.edu.bd',
    classDept: 'Administration',
    institution: 'Green Hill International School (GHIS-BD)',
    contact: '+8801711000001',
    status: 'Active',
    portalUrl: '/portal/greenhill-admin',
  },
  {
    id: 'u-3',
    role: 'TEACHER',
    roleCategory: 'teacher',
    fullName: 'Jannatul Ferdous',
    subtitle: 'Senior Teacher',
    assignedRollOrId: 'TCH-2022-004',
    classDept: 'Science (Physics)',
    institution: 'Green Hill International School (GHIS-BD)',
    contact: '+8801812345678',
    status: 'Active',
    portalUrl: '/portal/greenhill-teacher',
  },
  {
    id: 'u-4',
    role: 'STUDENT',
    roleCategory: 'student',
    fullName: 'Arif Hossain',
    subtitle: 'Verified Enrolled Student',
    assignedRollOrId: 'Roll #01\nGHIS-2024-1001',
    isRollBadge: true,
    classDept: 'Class 10 • Section A',
    institution: 'Green Hill International School (GHIS-BD)',
    contact: '+8801712987654',
    status: 'Active',
    portalUrl: '/student/portal',
  },
  {
    id: 'u-5',
    role: 'STUDENT',
    roleCategory: 'student',
    fullName: 'Tasnim Akter',
    subtitle: 'Verified Enrolled Student',
    assignedRollOrId: 'Roll #02\nGHIS-2024-2005',
    isRollBadge: true,
    classDept: 'Class 10 • Section A',
    institution: 'Green Hill International School (GHIS-BD)',
    contact: '+8801712987654',
    status: 'Active',
    portalUrl: '/student/portal',
  },
  {
    id: 'u-6',
    role: 'PARENT',
    roleCategory: 'parent',
    fullName: 'Mohammad Kamal',
    subtitle: 'Guardian of Arif & Tanvir',
    assignedRollOrId: 'PRN-2024-001',
    classDept: 'Guardian Portal',
    institution: 'Green Hill International School (GHIS-BD)',
    contact: '+8801711223344',
    status: 'Active',
    portalUrl: '/portal/greenhill-parent',
  },
];

export default function SuperAdminPage() {
  const [users, setUsers] = useState<UserItem[]>(initialUsersList);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.users)) {
          const mapped: UserItem[] = data.users.map((u: any) => {
            const role =
              u.role === 'super_admin'
                ? 'SUPERADMIN'
                : u.role === 'school_admin'
                ? 'SCHOOL ADMIN'
                : u.role === 'teacher'
                ? 'TEACHER'
                : u.role === 'student'
                ? 'STUDENT'
                : 'PARENT';
            const roleCategory = u.role as any;
            const isStudent = u.role === 'student';
            return {
              id: u.id,
              role,
              roleCategory,
              fullName: u.fullName,
              subtitle:
                u.subtitle ||
                (isStudent
                  ? 'Verified Enrolled Student'
                  : u.role === 'teacher'
                  ? 'Appointed Faculty'
                  : `${role} Member`),
              assignedRollOrId: isStudent
                ? `Roll #${u.rollNumber || '01'}\nGHIS-2024-${u.rollNumber || '1001'}`
                : u.phone || u.email,
              isRollBadge: isStudent,
              classDept:
                u.studentClass && u.studentSection
                  ? `${u.studentClass} • ${u.studentSection}`
                  : u.department || 'Administration',
              institution: u.schoolName,
              contact: u.phone || u.email,
              status: u.status === 'suspended' ? 'Suspended' : 'Active',
              portalUrl: isStudent ? '/student/portal' : '/portal/greenhill-admin',
            };
          });
          setUsers(mapped);
        }
      })
      .catch((err) => console.log('Using initial users state', err));

    fetch('/api/admissions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.applications)) {
          setAdmissions(data.applications);
        }
      })
      .catch((err) => console.log('Admissions fetch note:', err));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // New User Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<'STUDENT' | 'TEACHER' | 'PARENT' | 'SCHOOL ADMIN'>('STUDENT');
  const [formInstitution, setFormInstitution] = useState('Green Hill International School (GHIS-BD)');
  const [formClass, setFormClass] = useState('Class 10');
  const [formSection, setFormSection] = useState('Section A');
  const [formRoll, setFormRoll] = useState('Roll #03');
  const [formDept, setFormDept] = useState('Science (Chemistry)');
  const [formContact, setFormContact] = useState('');
  const [formPassword, setFormPassword] = useState('password123');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formContact) {
      alert('Please fill out all required fields');
      return;
    }

    const isStudent = formRole === 'STUDENT';
    const isTeacher = formRole === 'TEACHER';

    const newUser: UserItem = {
      id: `u-${Date.now()}`,
      role: formRole,
      roleCategory: formRole === 'STUDENT' ? 'student' : formRole === 'TEACHER' ? 'teacher' : formRole === 'PARENT' ? 'parent' : 'school_admin',
      fullName: formName,
      subtitle: isStudent ? 'Verified Enrolled Student' : isTeacher ? 'Appointed Faculty' : `${formRole} Member`,
      assignedRollOrId: isStudent ? `${formRoll}\nGHIS-2024-${1000 + users.length}` : isTeacher ? `TCH-2024-${String(users.length).padStart(3, '0')}` : formContact,
      isRollBadge: isStudent,
      classDept: isStudent ? `${formClass} • ${formSection}` : isTeacher ? formDept : 'Administration',
      institution: formInstitution,
      contact: formContact,
      status: 'Active',
      portalUrl: isStudent ? '/student/portal' : '/portal/greenhill-admin',
    };

    // Sync with Central Database
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formName,
        email: formContact.includes('@') ? formContact : `${formName.toLowerCase().replaceAll(' ', '')}@greenhill.edu.bd`,
        phone: formContact,
        password: formPassword,
        role: formRole === 'STUDENT' ? 'student' : formRole === 'TEACHER' ? 'teacher' : formRole === 'PARENT' ? 'parent' : 'school_admin',
        schoolName: formInstitution,
        studentClass: isStudent ? formClass : undefined,
        studentSection: isStudent ? formSection : undefined,
        rollNumber: isStudent ? formRoll.replace('Roll #', '').trim() : undefined,
        department: isTeacher ? formDept : undefined,
      }),
    }).catch((err) => console.error('Failed to sync user:', err));

    setUsers([newUser, ...users]);
    setIsModalOpen(false);
    setFormName('');
    setFormContact('');
    showToast(`🟢 Account successfully created for ${formName} (${formRole})!`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setUsers(users.filter((u) => u.id !== id));
      fetch(`/api/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
        .catch((err) => console.error('Delete user error:', err));
      showToast(`🔴 Account for ${name} removed from platform.`);
    }
  };

  const handleApproveAdmission = async (appId: string, studentName: string) => {
    try {
      const res = await fetch('/api/admissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, action: 'approve' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🟢 ${studentName} approved and enrolled! Active student account created.`);
        loadData();
      }
    } catch (err) {
      console.error('Approve admission error:', err);
    }
  };

  const handleRejectAdmission = async (appId: string, studentName: string) => {
    try {
      const res = await fetch('/api/admissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, action: 'reject', reviewNotes: 'Verification incomplete' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`❌ Application for ${studentName} rejected.`);
        loadData();
      }
    } catch (err) {
      console.error('Reject admission error:', err);
    }
  };

  const handleToggleSuspend = (id: string, name: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const next = u.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Account for ${name} is now ${next}.`);
          return { ...u, status: next };
        }
        return u;
      })
    );
  };

  const pendingAdmissions = admissions.filter((a) => a.status === 'pending');
  const pendingCount = pendingAdmissions.length;
  const studentCount = users.filter((u) => u.roleCategory === 'student').length;
  const teacherCount = users.filter((u) => u.roleCategory === 'teacher').length;
  const parentCount = users.filter((u) => u.roleCategory === 'parent').length;
  const adminCount = users.filter((u) => u.roleCategory === 'school_admin').length;
  const superCount = users.filter((u) => u.roleCategory === 'super_admin').length;
  const totalCount = users.length + pendingCount;

  const filteredAdmissions = pendingAdmissions.filter((adm) => {
    const q = searchTerm.toLowerCase();
    return (
      adm.fullName.toLowerCase().includes(q) ||
      (adm.phone && adm.phone.toLowerCase().includes(q)) ||
      (adm.desiredRoll && adm.desiredRoll.toLowerCase().includes(q)) ||
      adm.schoolName.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'student'
        ? u.roleCategory === 'student'
        : activeTab === 'teacher'
        ? u.roleCategory === 'teacher'
        : activeTab === 'parent'
        ? u.roleCategory === 'parent'
        : activeTab === 'admin'
        ? u.roleCategory === 'school_admin'
        : activeTab === 'super'
        ? u.roleCategory === 'super_admin'
        : false;

    const q = searchTerm.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.contact.toLowerCase().includes(q) ||
      u.assignedRollOrId.toLowerCase().includes(q) ||
      u.institution.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-[#070D1E] text-slate-100 font-sans overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#14234B] border border-blue-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR (Screenshot 2 & 7) */}
      <aside className="w-72 bg-[#0A132C] border-r border-[#16234D] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-[#16234D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-lg tracking-wider text-white">SIS DIGITAL</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    👑 Super Admin Control
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="px-4 py-5 space-y-1.5">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#5B46E8] text-white font-semibold text-xs shadow-lg shadow-indigo-600/30">
              <Users className="w-4 h-4" />
              <span>Universal Accounts & Roles</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#111D42] font-semibold text-xs transition">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Managed Institutions (316)</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#111D42] font-semibold text-xs transition">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span>Platform Revenue & System</span>
            </button>
          </div>

          {/* DIRECT PORTAL PREVIEWS */}
          <div className="px-5 pt-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2.5">
              Direct Portal Previews
            </p>
            <div className="space-y-1">
              <Link
                href="/login"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-sky-400 hover:bg-[#111D42] rounded-lg transition"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Universal Login Page</span>
              </Link>
              <Link
                href="/portal/greenhill-admin"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-[#111D42] rounded-lg transition"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>School Admin Portal</span>
              </Link>
              <button
                onClick={() => setActiveTab('pending')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-amber-400 hover:bg-[#111D42] rounded-lg transition text-left"
              >
                <span className="flex items-center gap-2.5">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">School Student Approvals</span>
                </span>
                {admissions.filter((a) => a.status === 'pending').length > 0 && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded text-[10px] font-bold">
                    {admissions.filter((a) => a.status === 'pending').length}
                  </span>
                )}
              </button>
              <Link
                href="/student/portal"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-[#111D42] rounded-lg transition"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student Portal</span>
              </Link>
              <Link
                href="/portal/greenhill-teacher"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-[#111D42] rounded-lg transition"
              >
                <Briefcase className="w-3.5 h-3.5 text-orange-400" />
                <span>Teacher Portal</span>
              </Link>
              <Link
                href="/portal/greenhill-parent"
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-[#111D42] rounded-lg transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Parent Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Status (Screenshot 2) */}
        <div className="p-4 m-4 rounded-xl bg-[#0F1B3B] border border-[#1C2C5E]">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM OPERATIONAL</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
            <p>API Latency: 11ms</p>
            <p>Multi-Tenant DB: Connected</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-[#091128] border-b border-[#16234D] px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              Enterprise Multi-Tenant SaaS • Super Admin Command Center
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/60 hover:bg-slate-800 transition"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Public Website</span>
            </Link>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-700/60">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-900 font-bold flex items-center justify-center text-xs shadow-md">
                RL
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">Rabeya Akter Lima</p>
                <p className="text-[10px] text-slate-400">rabeyaakterlima159@gmail.com</p>
              </div>
            </div>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold transition"
            >
              Logout
            </Link>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD BODY */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Header & Primary Action Button (Screenshot 5 & 7) */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <h2 className="text-2xl font-black text-white">Central User, Role & Roll Management</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                সুপার অ্যাডমিন ড্যাশবোর্ড থেকে যেকোনো প্রতিষ্ঠানের শিক্ষার্থী (রোল সহ), শিক্ষক, অভিভাবক ও অ্যাডমিন অ্যাকাউন্ট তৈরি করুন
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create New Account (রোল সহ অ্যাকাউন্ট তৈরি)</span>
            </button>
          </div>

          {/* 4 TOP METRIC CARDS (Screenshot 5 & 11) */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0D1836] border border-[#192754] shadow-lg">
              <p className="text-[11px] font-semibold text-slate-400">Total Enrolled Students</p>
              <p className="text-3xl font-black text-sky-400 mt-1">{studentCount}</p>
              <p className="text-xs font-semibold text-amber-400 mt-1">
                {pendingCount > 0 ? `+${pendingCount} pending approval` : 'All assigned with distinct rolls'}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0D1836] border border-[#192754] shadow-lg">
              <p className="text-[11px] font-semibold text-slate-400">Faculty & Teachers</p>
              <p className="text-3xl font-black text-sky-400 mt-1">{teacherCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">Active faculty members</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0D1836] border border-[#192754] shadow-lg">
              <p className="text-[11px] font-semibold text-slate-400">Parents & Guardians</p>
              <p className="text-3xl font-black text-sky-400 mt-1">{parentCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">Connected via bKash portal</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0D1836] border border-[#192754] shadow-lg">
              <p className="text-[11px] font-semibold text-slate-400">School Admins</p>
              <p className="text-3xl font-black text-sky-400 mt-1">{adminCount}</p>
              <p className="text-[10px] text-slate-500 mt-1">Campus managers</p>
            </div>
          </div>

          {/* FILTER TABS & SEARCH BAR (Screenshot 11) */}
          <div className="flex items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center bg-[#0D1836] p-1 rounded-xl border border-[#192754] text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'all' ? 'bg-[#5B46E8] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Users ({totalCount})
              </button>
              <button
                onClick={() => setActiveTab('student')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'student' ? 'bg-[#5B46E8] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 Students ({studentCount})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'pending' ? 'bg-[#5B46E8] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⏳ Pending Registrations ({pendingCount})</span>
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'teacher' ? 'bg-[#5B46E8] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👨‍🏫 Teachers ({teacherCount})
              </button>
              <button
                onClick={() => setActiveTab('parent')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'parent' ? 'bg-[#5B46E8] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👨‍👩‍👧 Parents ({parentCount})
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'admin' ? 'bg-[#5B46E8] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                🏛️ School Admins ({adminCount})
              </button>
              <button
                onClick={() => setActiveTab('super')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'super' ? 'bg-[#5B46E8] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                👑 Super Admins ({superCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, roll, student ID, mobile..."
                className="w-full pl-9 pr-4 py-2 bg-[#0D1836] border border-[#192754] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* MAIN UNIFIED DATA TABLE (Screenshot 11) */}
          <div className="bg-[#0D1836] border border-[#192754] rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#192754] text-slate-400 bg-[#091128]/60 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Role</th>
                  <th className="py-3.5 px-4 font-bold">Full Name</th>
                  <th className="py-3.5 px-4 font-bold">Assigned Roll / ID</th>
                  <th className="py-3.5 px-4 font-bold">Class / Dept</th>
                  <th className="py-3.5 px-4 font-bold">Institution</th>
                  <th className="py-3.5 px-4 font-bold">Contact</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192754]/60">
                {/* 1. Pending Registrations Rows (Visible in 'student', 'pending', and 'all' tabs) */}
                {(activeTab === 'student' || activeTab === 'pending' || activeTab === 'all') &&
                  filteredAdmissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-[#122046]/60 transition bg-[#172554]/20">
                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-sky-900/40 text-sky-300 border border-sky-500/30">
                          STUDENT
                        </span>
                      </td>

                      {/* Full Name */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-xs">{adm.fullName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{adm.email || 'Application Pending'}</p>
                      </td>

                      {/* Assigned Roll / ID Badge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-bold font-mono text-[11px] border border-blue-500/30">
                            Roll #{adm.desiredRoll}
                          </span>
                          <p className="text-[10px] font-mono text-slate-400">
                            {adm.id.startsWith('GHIS') ? adm.id : `GHIS-2025-${adm.id.replace(/\D/g, '').slice(-4) || '8478'}`}
                          </p>
                        </div>
                      </td>

                      {/* Class / Dept */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {adm.className} • {adm.section}
                      </td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        {adm.schoolName}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {adm.phone || adm.guardianPhone}
                      </td>

                      {/* Status: Amber Pending App Registration */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                          <span>⏳</span>
                          <span>Pending App Registration</span>
                        </span>
                      </td>

                      {/* Actions: Approve & Reject */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveAdmission(adm.id, adm.fullName)}
                            title="Approve student and enable mobile app login"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow transition"
                          >
                            <span>✓ Approve Account</span>
                          </button>
                          <button
                            onClick={() => handleRejectAdmission(adm.id, adm.fullName)}
                            className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <span>✕ Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* 2. Registered Users Rows (Hidden in 'pending' tab) */}
                {activeTab !== 'pending' &&
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#122046]/60 transition">
                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider ${
                            u.role === 'SUPERADMIN'
                              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                              : u.role === 'SCHOOL ADMIN'
                              ? 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
                              : u.role === 'TEACHER'
                              ? 'bg-teal-900/40 text-teal-300 border border-teal-500/30'
                              : u.role === 'STUDENT'
                              ? 'bg-sky-900/40 text-sky-300 border border-sky-500/30'
                              : 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Full Name & Title */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-xs">{u.fullName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{u.subtitle}</p>
                      </td>

                      {/* Assigned Roll / ID Badge */}
                      <td className="py-3.5 px-4">
                        {u.isRollBadge ? (
                          <div className="space-y-0.5">
                            <span className="inline-block px-2 py-0.5 rounded bg-blue-600/30 text-blue-400 font-bold font-mono text-[11px] border border-blue-500/30">
                              {u.assignedRollOrId.split('\n')[0]}
                            </span>
                            {u.assignedRollOrId.includes('\n') && (
                              <p className="text-[10px] font-mono text-slate-400">
                                {u.assignedRollOrId.split('\n')[1]}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-sky-400">{u.assignedRollOrId}</span>
                        )}
                      </td>

                      {/* Class / Dept */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{u.classDept}</td>

                      {/* Institution */}
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{u.institution}</td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">{u.contact}</td>

                      {/* Status: Active (Supabase) or Suspended */}
                      <td className="py-3.5 px-4">
                        {u.role === 'STUDENT' && u.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>• Active (Supabase)</span>
                          </span>
                        ) : (
                          <span
                            className={`text-[11px] font-bold ${
                              u.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {u.status}
                          </span>
                        )}
                      </td>

                      {/* Actions: Direct Login Preview, Suspend, Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={u.portalUrl}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow transition"
                          >
                            <span>🚀 Login Portal</span>
                          </Link>
                          <button
                            onClick={() => handleToggleSuspend(u.id, u.fullName)}
                            className="px-2.5 py-1 rounded-lg border border-slate-600 hover:bg-slate-700/60 text-slate-300 text-[11px] font-medium transition"
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.fullName)}
                            className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {/* Empty State */}
                {activeTab === 'pending' && filteredAdmissions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No pending student registrations at this time.
                    </td>
                  </tr>
                )}
                {activeTab !== 'pending' && filteredUsers.length === 0 && filteredAdmissions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No users found matching this filter or search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* CREATE NEW ACCOUNT MODAL (Screenshot 5 & 7) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1836] border border-[#1F2F63] rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2F63]">
              <div className="flex items-center gap-2">
                <span className="text-xl">👑</span>
                <h3 className="font-black text-white text-base">
                  + Create New Account (রোল সহ অ্যাকাউন্ট তৈরি)
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Full Name (শিক্ষার্থীর বা ব্যবহারকারীর পুরো নাম) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arif Hossain / Dr. Rafiqul"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#091128] border border-[#1F2F63] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Account Role *</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#091128] border border-[#1F2F63] rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="STUDENT">🎓 Student (শিক্ষার্থী)</option>
                    <option value="TEACHER">👨‍🏫 Teacher (শিক্ষক)</option>
                    <option value="PARENT">👨‍👩‍👧 Parent (অভিভাবক)</option>
                    <option value="SCHOOL ADMIN">🏛️ School Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Institution / Campus *</label>
                  <select
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-[#091128] border border-[#1F2F63] rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Green Hill International School (GHIS-BD)">
                      Green Hill International School
                    </option>
                    <option value="Dhaka Premier International School">
                      Dhaka Premier International School
                    </option>
                    <option value="Chittagong Model College">Chittagong Model College</option>
                  </select>
                </div>
              </div>

              {/* Conditional Fields for Student */}
              {formRole === 'STUDENT' && (
                <div className="p-3.5 bg-[#091128]/70 border border-blue-500/30 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Class</label>
                      <input
                        type="text"
                        value={formClass}
                        onChange={(e) => setFormClass(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0D1836] border border-[#1F2F63] rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Section</label>
                      <input
                        type="text"
                        value={formSection}
                        onChange={(e) => setFormSection(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0D1836] border border-[#1F2F63] rounded-lg text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Assigned Roll Number (রোল নম্বর)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Roll #03"
                      value={formRoll}
                      onChange={(e) => setFormRoll(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D1836] border border-[#1F2F63] rounded-lg text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Conditional Fields for Teacher */}
              {formRole === 'TEACHER' && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Faculty / Department</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    placeholder="e.g. Science (Physics & Mathematics)"
                    className="w-full px-3.5 py-2.5 bg-[#091128] border border-[#1F2F63] rounded-xl text-white placeholder-slate-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Email / Mobile (লগইন ইউজারনেম) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="user@greenhill.edu.bd"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#091128] border border-[#1F2F63] rounded-xl text-white placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Default Password *</label>
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#091128] border border-[#1F2F63] rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create & Assign Access</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
