'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CalendarCheck, 
  BookOpen, 
  Bell, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  Sparkles,
  Plus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { StatusChip } from '@/components/ui/StatusChip';
import { mockNotices, mockHomework, mockTimetable, mockStudents } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function HomePage() {
  const { locale, t } = useLocale();
  const { role, activeChild, profile } = useRoleSession();

  // If Parent role
  if (role === 'parent') {
    const urgentNotice = mockNotices.find((n) => n.priority === 'urgent') || mockNotices[0];
    const childHomework = mockHomework.slice(0, 2);
    const todayPeriods = mockTimetable.slice(0, 4);

    return (
      <div className="space-y-6">
        {/* Child Context Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-lg font-bold shadow-xs">
              {activeChild.first_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  {locale === 'hi' && activeChild.first_name_hi 
                    ? `${activeChild.first_name_hi} ${activeChild.last_name_hi}` 
                    : `${activeChild.first_name} ${activeChild.last_name}`}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-[#1E3A8A] font-semibold">
                  {activeChild.className} - {activeChild.sectionName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Scholar ID: <span className="font-mono font-medium text-slate-700">{activeChild.admission_number}</span> • Roll #{activeChild.roll_number}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/portal/student"
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {locale === 'hi' ? '360° प्रोफ़ाइल देखें' : 'View 360° Profile'}
            </Link>
          </div>
        </div>

        {/* Priority Urgent Broadcast */}
        {urgentNotice && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  {t('notices.urgent')}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {locale === 'hi' && urgentNotice.title_hi ? urgentNotice.title_hi : urgentNotice.title}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {locale === 'hi' && urgentNotice.content_hi ? urgentNotice.content_hi : urgentNotice.content}
              </p>
            </div>
            <Link
              href="/portal/notices"
              className="text-xs font-semibold text-[#1E3A8A] hover:underline shrink-0 self-center"
            >
              {t('common.viewAll')} →
            </Link>
          </div>
        )}

        {/* 4 Core Quick Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Attendance */}
          <Link
            href="/portal/attendance"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('attendance.title')}</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{activeChild.attendancePct}%</span>
              <span className="text-[10px] font-semibold text-emerald-600">
                {locale === 'hi' ? 'परीक्षा योग्य' : 'Eligible'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{t('attendance.todayStatus')}:</span>
              <StatusChip status="present" locale={locale} />
            </div>
          </Link>

          {/* Fees */}
          <Link
            href="/portal/fees"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-amber-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('fees.title')}</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{formatCurrency(activeChild.totalFeeDue || 0)}</span>
              <span className="text-[10px] font-semibold text-emerald-600">
                {locale === 'hi' ? 'बकाया नहीं' : 'No Due'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Q2 Clearance:</span>
              <StatusChip status="paid" locale={locale} />
            </div>
          </Link>

          {/* Homework */}
          <Link
            href="/portal/homework"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('homework.title')}</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">2</span>
              <span className="text-[10px] font-semibold text-blue-600">
                {locale === 'hi' ? 'गृहकार्य सक्रिय' : 'Active Tasks'}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 truncate">
              Math & Hindi Due Soon
            </div>
          </Link>

          {/* Timetable */}
          <Link
            href="/portal/timetable"
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-purple-400 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('timetable.title')}</span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">6</span>
              <span className="text-[10px] font-semibold text-slate-500">
                {locale === 'hi' ? 'घंटी / कालांश' : 'Periods Today'}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 truncate">
              Next: 08:30 Math (Room 204)
            </div>
          </Link>
        </div>

        {/* 2-Column Split: Active Homework & Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Homework */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#1E3A8A]" />
                {t('homework.title')}
              </h2>
              <Link href="/portal/homework" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                {t('common.viewAll')}
              </Link>
            </div>

            <div className="space-y-3">
              {childHomework.map((hw) => (
                <div key={hw.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E3A8A] px-2 py-0.5 rounded bg-blue-100">
                      {hw.subjectName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Due: {formatDate(hw.due_date, locale)}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900 mt-2">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {hw.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Timetable */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1E3A8A]" />
                {t('timetable.title')} (Monday)
              </h2>
              <Link href="/portal/timetable" className="text-xs font-semibold text-[#1E3A8A] hover:underline">
                {t('common.viewAll')}
              </Link>
            </div>

            <div className="space-y-2.5">
              {todayPeriods.map((slot, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    slot.isRecess 
                      ? 'bg-amber-50/60 border-amber-200 text-amber-900' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {slot.periodNumber}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{slot.subjectName}</p>
                      <p className="text-[11px] text-slate-500">{slot.teacherName} • {slot.roomNumber}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-600 font-medium">
                    {slot.startTime} - {slot.endTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Teacher role
  if (role === 'teacher') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {locale === 'hi' ? 'शिक्षक पोर्टल' : 'Teacher Portal'}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {locale === 'hi' ? 'नमस्ते, सुनीता मिश्रा' : 'Welcome, Sunita Mishra'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Class Teacher: Class 5-A (Room 204) • 42 Enrolled Students
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/portal/attendance"
              className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-xs hover:bg-blue-900 transition-all flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              {locale === 'hi' ? 'दैनिक हाजिरी दर्ज करें' : 'Record Today\'s Roll Call'}
            </Link>
          </div>
        </div>

        {/* Quick Teacher Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/portal/attendance"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {locale === 'hi' ? 'दैनिक हाजिरी (Roll Call)' : 'Daily Attendance Roll Call'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {locale === 'hi' ? 'कक्षा 5-A के 42 छात्रों की उपस्थिति दर्ज करें' : 'Mark present/absent with single tap toggles'}
            </p>
          </Link>

          <Link
            href="/portal/homework"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {locale === 'hi' ? 'गृहकार्य जारी करें' : 'Post Homework / Assignment'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {locale === 'hi' ? 'गणित व अन्य विषयों के अभ्यास प्रश्न भेजें' : 'Share textbook exercises and attach worksheets'}
            </p>
          </Link>

          <Link
            href="/portal/notices"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {locale === 'hi' ? 'अभिभावक सूचना जारी करें' : 'Broadcast Notice to Parents'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {locale === 'hi' ? 'पीटीएम, परीक्षा व अवकाश की सूचना तुरंत प्रेषित करें' : 'Instant announcements with push alerts'}
            </p>
          </Link>
        </div>
      </div>
    );
  }

  // If Admin role
  if (role === 'admin') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
                CBSE Affiliation #3430198 • UDISE 20191509702
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              {locale === 'hi' ? 'ज्ञान स्थली प्रशासनिक कंसोल' : 'Executive Administrative Console'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive enrollment registers, biometric thresholds, and RTE quota verifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/portal/students"
              className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-xs hover:bg-blue-900 transition-all"
            >
              + {locale === 'hi' ? 'नया छात्र नामांकन' : 'New Student Admission'}
            </Link>
          </div>
        </div>

        {/* Executive Metric Summary Strip from Stitch Screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Active Enrollment
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">1,428</span>
                <span className="text-xs font-semibold text-emerald-600">99.2% Capacity</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Nursery to Class 8 (38 Sections)</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Gender Ratio (B / G)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">54.6%</span>
                <span className="text-xs text-slate-500">/ 45.4%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">780 Boys • 648 Girls</p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                RTE / EWS Quota
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">182</span>
                <span className="text-xs font-semibold text-blue-600">12.7% Verified</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Section 12(1)(c) Compliance Met</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Low Attendance (&lt;75%)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-red-600">28</span>
                <span className="text-xs font-semibold text-red-600">At-Risk Alert</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Notice issued to guardians</p>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Shortcut to Student Directory */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {locale === 'hi' ? 'छात्र निर्देशिका एवं 360° लेजर' : 'Master Students Directory'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by class, gender, social category, fee clearance, and attendance range.
            </p>
          </div>
          <Link
            href="/portal/students"
            className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900 transition-colors flex items-center gap-1.5"
          >
            <span>{locale === 'hi' ? 'निर्देशिका खोलें' : 'Open Directory'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Student portal fallback
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">
          {locale === 'hi' ? 'छात्र शिक्षण केंद्र' : 'Student Learning Hub'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {activeChild.first_name} {activeChild.last_name} • {activeChild.className} - {activeChild.sectionName}
        </p>
      </div>
    </div>
  );
}
