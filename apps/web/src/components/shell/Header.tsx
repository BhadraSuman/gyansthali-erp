'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, GraduationCap, Users, Shield, BookOpen, LogOut } from 'lucide-react';
import { useLocale } from '../providers/LocaleProvider';
import { useRoleSession } from '../providers/RoleSessionProvider';
import type { UserRole } from '@gyansthali/api-types';

export function Header() {
  const { locale, setLocale, t } = useLocale();
  const { role, setRole, profile } = useRoleSession();

  const roleLabels: Record<UserRole, { en: string; hi: string; color: string }> = {
    parent: { en: 'Parent', hi: 'अभिभावक', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    teacher: { en: 'Teacher', hi: 'शिक्षक', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    admin: { en: 'Admin', hi: 'प्रधानाचार्य', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    student: { en: 'Student', hi: 'छात्र', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    accountant: { en: 'Accounts', hi: 'लेखाकार', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Crest */}
        <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
          <div className="relative w-9 h-9 rounded-lg bg-blue-900/5 p-1 flex items-center justify-center shrink-0 border border-blue-900/10">
            <Image
              src="/logo.svg"
              alt="Gyan Sthali Public School"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-[#1E3A8A] leading-tight truncate font-sans">
              {locale === 'hi' ? 'ज्ञान स्थली' : 'Gyan Sthali'}
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
              Public School • GSPS
            </span>
          </div>
        </Link>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Academic Session Pill */}
          <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-[#1E3A8A] text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>AY 2024-25</span>
          </div>

          {/* Role Badge & Switcher for Demo evaluation */}
          <div className="relative">
            <select
              aria-label="Switch User Role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className={`text-xs font-bold rounded-lg px-2 py-1.5 border appearance-none pr-6 cursor-pointer bg-white ${roleLabels[role].color}`}
            >
              <option value="parent">👨‍👩‍👧 {locale === 'hi' ? 'अभिभावक (Parent)' : 'Parent'}</option>
              <option value="teacher">👩‍🏫 {locale === 'hi' ? 'शिक्षक (Teacher)' : 'Teacher'}</option>
              <option value="student">👨‍🎓 {locale === 'hi' ? 'छात्र (Student)' : 'Student'}</option>
              <option value="admin">🏛️ {locale === 'hi' ? 'एडमिन (Admin)' : 'Admin'}</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Bilingual Language Switcher */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${
                locale === 'en'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale('hi')}
              className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${
                locale === 'hi'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notifications Alert */}
          <Link
            href="/portal/notices"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title={t('common.notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
          </Link>

          {/* User Profile Info */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center">
              {profile.full_name.charAt(0)}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {profile.full_name}
              </span>
              <span className="text-[10px] text-slate-500 capitalize">
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
