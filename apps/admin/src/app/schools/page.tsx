'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import {
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Edit,
  Trash2,
  Palette,
  Shield,
  Save,
  X,
} from 'lucide-react';

interface SchoolRecord {
  id: string;
  name: string;
  code: string;
  slug: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'suspended' | 'trial';
  plan: string;
  primaryColor: string;
  studentsCount: number;
  teachersCount: number;
}

const initialSchools: SchoolRecord[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: 'Dhaka Premier International School',
    code: 'SCH-DPIS-01',
    slug: 'dhaka-premier',
    email: 'admin@dhakapremier.edu.bd',
    phone: '+8801711000001',
    city: 'Dhaka',
    status: 'active',
    plan: 'Pro Campus',
    primaryColor: '#102A56',
    studentsCount: 1840,
    teachersCount: 112,
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: 'Chittagong Model College',
    code: 'SCH-CMC-02',
    slug: 'chittagong-model',
    email: 'info@cmc.edu.bd',
    phone: '+8801811000002',
    city: 'Chittagong',
    status: 'active',
    plan: 'Basic Campus',
    primaryColor: '#0F3D3E',
    studentsCount: 620,
    teachersCount: 45,
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    name: 'Sylhet Global Academy',
    code: 'SCH-SGA-03',
    slug: 'sylhet-academy',
    email: 'contact@sylhetglobal.edu.bd',
    phone: '+8801911000003',
    city: 'Sylhet',
    status: 'trial',
    plan: 'Free Starter',
    primaryColor: '#1B2A4A',
    studentsCount: 95,
    teachersCount: 12,
  },
];

export default function SchoolsManagementPage() {
  const [schools, setSchools] = useState<SchoolRecord[]>(initialSchools);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'trial'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolRecord | null>(null);

  // New school form state
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPlan, setFormPlan] = useState('Pro Campus');
  const [formColor, setFormColor] = useState('#102A56');

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode || !formEmail) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const newRecord: SchoolRecord = {
      id: 'sch-' + Date.now(),
      name: formName,
      code: formCode.toUpperCase(),
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      email: formEmail,
      phone: '+880170000000',
      city: formCity || 'Dhaka',
      status: 'active',
      plan: formPlan,
      primaryColor: formColor,
      studentsCount: 0,
      teachersCount: 0,
    };

    setSchools([newRecord, ...schools]);
    setIsModalOpen(false);
    // Reset form
    setFormName('');
    setFormCode('');
    setFormEmail('');
    setFormCity('');
    alert(`Campus "${newRecord.name}" successfully registered and provisioned!`);
  };

  const toggleSchoolStatus = (id: string) => {
    setSchools(
      schools.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'suspended' : 'active';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0B132B]">
      <AdminHeader title="School Tenants Management" subtitle="Create, Provision, and Manage Campuses" />

      <main className="p-8 space-y-6 flex-1 overflow-y-auto">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campus code, name, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131D38] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-[#131D38] border border-slate-800 rounded-lg p-1 text-xs">
              {(['all', 'active', 'trial', 'suspended'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-md capitalize transition ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition self-stretch sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Provision New School
          </button>
        </div>

        {/* Schools Table */}
        <div className="bg-[#131D38] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E172E] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">School & Code</th>
                  <th className="py-3.5 px-4 font-semibold">City</th>
                  <th className="py-3.5 px-4 font-semibold">Subscription Plan</th>
                  <th className="py-3.5 px-4 font-semibold">Enrolled Stats</th>
                  <th className="py-3.5 px-4 font-semibold">Branding</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 text-sm">{school.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-blue-400">{school.code}</span>
                        <span>•</span>
                        <span>{school.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{school.city}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                        {school.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="font-bold">{school.studentsCount.toLocaleString()} Students</div>
                      <div className="text-[11px] text-slate-400">{school.teachersCount} Faculty</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded border border-slate-600 shadow"
                          style={{ backgroundColor: school.primaryColor }}
                          title={`Primary: ${school.primaryColor}`}
                        />
                        <span className="text-[11px] font-mono text-slate-400">{school.primaryColor}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          school.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : school.status === 'trial'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            school.status === 'active'
                              ? 'bg-emerald-400'
                              : school.status === 'trial'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        {school.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => toggleSchoolStatus(school.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                          school.status === 'active'
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {school.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <a
                        href={`http://localhost:3000/portal/${school.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition inline-flex items-center gap-1"
                      >
                        Visit Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provisioning Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#131D38] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Provision New School Tenant</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSchool} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Campus Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barisal Cadet Academy"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#0E172E] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Unique School Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SCH-BCA-05"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value)}
                      className="w-full bg-[#0E172E] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 uppercase font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barisal"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="w-full bg-[#0E172E] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Official Administrative Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. principal@bca.edu.bd"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#0E172E] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Subscription Plan</label>
                    <select
                      value={formPlan}
                      onChange={(e) => setFormPlan(e.target.value)}
                      className="w-full bg-[#0E172E] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Free Starter">Free Starter (100 students)</option>
                      <option value="Basic Campus">Basic Campus (500 students)</option>
                      <option value="Pro Campus">Pro Campus (2,500 students)</option>
                      <option value="Enterprise Multi-Branch">Enterprise (Unlimited)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Brand Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        className="w-9 h-9 bg-transparent rounded cursor-pointer border border-slate-700"
                      />
                      <input
                        type="text"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        className="flex-1 bg-[#0E172E] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Provision Tenant
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
