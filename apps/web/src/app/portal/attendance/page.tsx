'use client';

import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Save, 
  ShieldAlert, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { StatusChip } from '@/components/ui/StatusChip';
import { 
  getStudentAttendanceSummary, 
  getStudentAttendanceHistory, 
  submitAttendanceRollCall,
  type DailyAttendanceRecord 
} from '@/data/attendance';
import { mockStudents } from '@/data/mockData';
import type { AttendanceStatus, AttendanceRollCallItem } from '@gyansthali/api-types';

export default function AttendancePage() {
  const { locale, t } = useLocale();
  const { role, activeChild } = useRoleSession();

  // State for Parent View
  const [history, setHistory] = useState<DailyAttendanceRecord[]>([]);
  const [summary, setSummary] = useState({
    percentage: 94.2,
    totalDays: 134,
    presentDays: 126,
    absentDays: 6,
    lateDays: 2,
    isExamEligible: true,
  });

  // State for Teacher Roll Call View
  const [rollCallList, setRollCallList] = useState<AttendanceRollCallItem[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load parent child attendance
    getStudentAttendanceSummary(activeChild.id).then(setSummary);
    getStudentAttendanceHistory(activeChild.id).then(setHistory);

    // Initialize teacher roll call with Class 5-A students
    const classStudents = mockStudents.map((s) => ({
      studentId: s.id,
      rollNumber: s.roll_number,
      studentName: s.first_name + ' ' + s.last_name,
      studentNameHi: s.first_name_hi ? s.first_name_hi + ' ' + s.last_name_hi : null,
      status: (s.id === 'std00000-0000-0000-0000-000000000008' ? 'absent' : 'present') as AttendanceStatus,
    }));
    setRollCallList(classStudents);
  }, [activeChild.id]);

  const handleStatusToggle = (studentId: string, newStatus: AttendanceStatus) => {
    setRollCallList((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status: newStatus } : item))
    );
    setIsSaved(false);
  };

  const handleMarkAllPresent = () => {
    setRollCallList((prev) => prev.map((item) => ({ ...item, status: 'present' })));
    setIsSaved(false);
  };

  const handleSaveRollCall = async () => {
    await submitAttendanceRollCall('s0000000-0000-0000-0000-00000000005a', new Date().toISOString().split('T')[0], rollCallList);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  // If Teacher Role: Interactive Roll Call Screen
  if (role === 'teacher') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {locale === 'hi' ? 'दैनिक उपस्थिति रजिस्टर' : 'Daily Roll Call Register'}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Class 5-A • Room 204
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              {t('attendance.markAllPresent')}
            </button>
            <button
              type="button"
              onClick={handleSaveRollCall}
              className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-xs hover:bg-blue-900 transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {t('attendance.saveRollCall')}
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t('attendance.rollCallSaved')}
          </div>
        )}

        {/* Student Roll Call List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {locale === 'hi' ? 'छात्र सूची (क्रमांक अनुसार)' : 'Student Name & Roll No.'}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase">
              {locale === 'hi' ? 'स्थिति चुनें' : 'Mark Status'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {rollCallList.map((item) => {
              const displayName = locale === 'hi' && item.studentNameHi ? item.studentNameHi : item.studentName;

              return (
                <div key={item.studentId} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {item.rollNumber}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{displayName}</p>
                      <p className="text-[11px] text-slate-500">Roll #{item.rollNumber}</p>
                    </div>
                  </div>

                  {/* Big Tap Buttons (Stitch requirement: >= 48px touch bound) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(item.studentId, 'present')}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        item.status === 'present'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      P
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(item.studentId, 'absent')}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        item.status === 'absent'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(item.studentId, 'late')}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        item.status === 'late'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      L
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Parent & Student View: Attendance Calendar & Percentage
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {t('attendance.title')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeChild.first_name} {activeChild.last_name} • {activeChild.className} - {activeChild.sectionName}
            </p>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors self-start sm:self-auto"
          >
            {t('attendance.applyLeave')}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">{t('attendance.monthlyPercentage')}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1E3A8A]">{summary.percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full rounded-full ${summary.percentage >= 75 ? 'bg-emerald-600' : 'bg-red-600'}`} 
                style={{ width: `${summary.percentage}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">{t('attendance.totalDays')}</span>
            <p className="mt-2 text-2xl font-bold text-slate-900">{summary.totalDays}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Academic Year 2024-25</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">{t('attendance.daysPresent')}</span>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{summary.presentDays}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Full Attendance</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">{t('attendance.daysAbsent')}</span>
            <p className="mt-2 text-2xl font-bold text-red-700">{summary.absentDays}</p>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">{summary.lateDays} Late Arrivals</span>
          </div>
        </div>

        {/* CBSE Exam Eligibility Alert */}
        <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
          summary.percentage >= 75
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {summary.percentage >= 75 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <p className="font-bold">
              {summary.percentage >= 75
                ? (locale === 'hi' ? 'सीबीएसई परीक्षा पात्रता पूर्ण' : 'CBSE Examination Eligibility Standard Met')
                : (locale === 'hi' ? 'चेतावनी: उपस्थिति 75% से कम है' : 'Critical Warning: Attendance Below 75% Threshold')}
            </p>
            <p className="mt-0.5 opacity-90">{t('attendance.eligibilityNotice')}</p>
          </div>
        </div>
      </div>

      {/* Daily Records Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          {locale === 'hi' ? 'हाल की दैनिक उपस्थिति विवरण' : 'Recent Daily Attendance History'}
        </h2>

        <div className="divide-y divide-slate-100">
          {history.map((rec, i) => (
            <div key={i} className="py-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {new Date(rec.date).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                {rec.remarks && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{rec.remarks}</p>
                )}
              </div>
              <StatusChip status={rec.status} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
