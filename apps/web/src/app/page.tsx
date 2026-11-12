'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Smartphone,
  Laptop,
  CheckCircle2,
  CreditCard,
  Bell,
  Calendar,
  Award,
  BookOpen,
  HelpCircle,
  ChevronDown,
  Layers,
  Activity,
  Flame,
} from 'lucide-react';

const featureList = [
  {
    icon: Building2,
    title: 'Multi-Tenant Architecture',
    desc: 'Each educational institution operates in its own isolated workspace with customized branding, domains, and strict PostgreSQL Row Level Security (RLS).',
  },
  {
    icon: Sparkles,
    title: 'Server-Driven UI (SDUI)',
    desc: 'Super Admin and school leaders modify theme colors, reorder home dashboard widgets, and toggle feature modules dynamically without app store releases.',
  },
  {
    icon: CreditCard,
    title: 'Bangladesh Payment Gateways',
    desc: 'Native tokenized checkout with bKash, Nagad, and SSLCommerz. Generates tamper-proof digital receipts upon verified webhook callbacks.',
  },
  {
    icon: Calendar,
    title: 'Real-Time Attendance & FCM',
    desc: 'Daily or subject-wise student attendance with instant Firebase Cloud Messaging alerts dispatched directly to parents’ smartphones.',
  },
  {
    icon: Award,
    title: 'Examinations & GPA 5.0 Engine',
    desc: 'Automated term examination schedules, teacher marks entry, dynamic grading curves, class ranks, and downloadable digital report cards.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security & Audit',
    desc: 'Zero client-trusted IDs. Every request is verified server-side with cryptographic JWT tokens and comprehensive immutable audit trails.',
  },
];

const rolePortals = [
  {
    role: 'student',
    title: 'Student Portal',
    badge: 'Mobile & Web',
    desc: 'Timetable, attendance tracker (95%), assignment submissions, exam results, digital library, and online fee payments.',
    color: 'from-blue-600 to-indigo-600',
    slug: 'dhaka-premier',
  },
  {
    role: 'parent',
    title: 'Parent Portal',
    badge: 'Multi-Child Sync',
    desc: 'Unified dashboard for all linked children, real-time absence alerts, report cards, teacher chat, and fee clearance.',
    color: 'from-emerald-600 to-teal-600',
    slug: 'dhaka-premier',
  },
  {
    role: 'teacher',
    title: 'Teacher & Faculty Hub',
    badge: 'Academic Management',
    desc: 'Assigned classes, daily period timetable, bulk student attendance entry, homework evaluations, and marks entry.',
    color: 'from-amber-600 to-orange-600',
    slug: 'dhaka-premier',
  },
  {
    role: 'school_admin',
    title: 'School Administrator',
    badge: 'Tenant Leadership',
    desc: 'Full campus control: admissions, fee structures, faculty assignments, transport fleet, announcements, and reports.',
    color: 'from-purple-600 to-indigo-700',
    slug: 'dhaka-premier',
  },
];

const pricingPlans = [
  {
    name: 'Free Starter',
    price: '৳0',
    period: 'forever',
    students: '100 Students',
    faculty: '10 Teachers',
    features: ['Daily Attendance Tracking', 'Student & Parent Portals', 'Basic Performance Reports'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Basic Campus',
    price: '৳2,500',
    period: '/ month',
    students: '500 Students',
    faculty: '35 Teachers',
    features: ['Attendance & Period Timetable', 'Fee Management & Invoicing', 'SMS & Push Notifications', 'Term Examination Schedules'],
    cta: 'Provision Basic',
    popular: false,
  },
  {
    name: 'Pro Campus',
    price: '৳6,500',
    period: '/ month',
    students: '2,500 Students',
    faculty: '150 Teachers',
    features: ['All Basic Campus Features', 'bKash / Nagad / SSLCommerz', 'Digital Library & Transport Fleet', 'SDUI Dynamic Customizer', 'Digital Receipts & Analytics'],
    cta: 'Provision Pro Campus',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '৳15,000',
    period: '/ month',
    students: 'Unlimited Students',
    faculty: '500+ Teachers',
    features: ['All Pro Campus Features', 'Custom White-Label Domain', 'Biometric Hardware Sync', 'Dedicated Database Node', '24/7 SLA Priority Guarantee'],
    cta: 'Contact Enterprise',
    popular: false,
  },
];

const faqs = [
  {
    q: 'How does multi-tenant isolation work in EDUVANTA?',
    a: 'Every school is provisioned as an independent tenant with a unique school_id. Database access is strictly enforced via PostgreSQL Row Level Security (RLS) policies. Users from one campus cannot query or view records belonging to another campus under any circumstances.',
  },
  {
    q: 'What is Server-Driven UI (SDUI) and why is it beneficial?',
    a: 'Server-Driven UI allows platform administrators and school leaders to update layout sections, reorder dashboard widgets, add banners, and update theme branding colors on the fly from the admin dashboard. Both the Flutter Android app and the Next.js web app instantly render the updated layout without requiring app store updates.',
  },
  {
    q: 'Are Bangladesh payment gateways (bKash, Nagad, SSLCommerz) fully supported?',
    a: 'Yes! EDUVANTA features integrated payment contracts with tokenized checkout for bKash, Nagad, and SSLCommerz. Fee statuses are updated only after cryptographic server-side validation callbacks, automatically issuing digital receipts.',
  },
  {
    q: 'Can parents monitor multiple children enrolled in different classes?',
    a: 'Yes. Verified parent accounts link to multiple child profiles, allowing parents to switch between children effortlessly to view individual attendance rates, grade report cards, and dues.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-[#F5F8FC] via-white to-[#F5F8FC]">
          <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              SMARTER CAMPUS • BRIGHTER FUTURE
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-black text-[#102A56] tracking-tight leading-tight max-w-4xl mx-auto">
              One Platform. Every Campus. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#3B82F6]">
                Smarter Education.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              EDUVANTA is the enterprise-grade multi-tenant educational ecosystem uniting administrators, teachers, students, and parents with real-time academic workflows and dynamic Server-Driven UI.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/portal/dhaka-premier?role=student"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#102A56] hover:bg-[#1a3d75] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-950/25 transition flex items-center justify-center gap-2"
              >
                Launch Campus Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Super Admin Console
              </a>
            </div>

            {/* Visual Hero Showcase Banner */}
            <div className="pt-10 max-w-5xl mx-auto">
              <div className="relative rounded-3xl p-2 bg-gradient-to-b from-blue-500/20 to-indigo-500/10 border border-blue-200/60 shadow-2xl overflow-hidden">
                <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-inner relative">
                  <img
                    src="/branding/eduvanta-banner.jpg"
                    alt="EDUVANTA Ecosystem: Android App, Next.js Web Portal, and Super Admin Dashboard"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-10 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-Tenant Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Server-Driven UI Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>bKash, Nagad & SSLCommerz</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Firebase Push Notifications</span>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PLATFORM FEATURES */}
        <section id="features" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                Enterprise Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#102A56]">
                Built for Scalable, Secure Campus Operations
              </h2>
              <p className="text-sm text-slate-600">
                A unified foundation engineered with modern technology for maximum performance and airtight security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureList.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-[#F5F8FC] border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition space-y-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTERACTIVE ECOSYSTEM ROLE PORTALS */}
        <section id="roles" className="py-20 bg-[#F5F8FC]">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                Role-Based Experiences
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#102A56]">
                Tailored Portals for Every Member of Campus
              </h2>
              <p className="text-sm text-slate-600">
                Click any portal below to launch the live interactive interface with real Supabase academic data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rolePortals.map((item) => (
                <div
                  key={item.title}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                    <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>

                  <Link
                    href={`/portal/${item.slug}?role=${item.role}`}
                    className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition text-center flex items-center justify-center gap-1.5"
                  >
                    Open {item.title}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section id="pricing" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                Transparent SaaS Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#102A56]">
                Predictable Plans Built for Institutions of Any Size
              </h2>
              <p className="text-sm text-slate-600">
                All plans include free onboarding, automatic security updates, and multi-user access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 border transition flex flex-col justify-between ${
                    plan.popular
                      ? 'border-blue-600 shadow-xl bg-blue-50/30 relative'
                      : 'border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-xs text-slate-500">{plan.period}</span>
                    </div>

                    <div className="text-xs font-semibold text-blue-700 pb-3 border-b border-slate-200 mb-4">
                      {plan.students} • {plan.faculty}
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      {plan.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/portal/dhaka-premier?plan=${plan.name}`}
                    className={`mt-6 w-full py-2.5 text-xs font-bold rounded-xl transition text-center ${
                      plan.popular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="py-20 bg-[#F5F8FC]">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl font-black text-[#102A56]">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={faq.q}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left text-sm font-bold text-slate-800 flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
