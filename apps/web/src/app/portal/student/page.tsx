'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Phone, MapPin, Bus, ShieldCheck, Calendar, Heart, FileText } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { mockStudents } from '@/data/mockData';
import { StatusChip } from '@/components/ui/StatusChip';

import { Suspense } from 'react';

function StudentProfileContent() {
  const { locale, t } = useLocale();
  const searchParams = useSearchParams();
  const { activeChild } = useRoleSession();

  const studentId = searchParams.get('id');
  const student = studentId ? (mockStudents.find((s) => s.id === studentId) || activeChild) : activeChild;

  const displayName = locale === 'hi' && student.first_name_hi 
    ? `${student.first_name_hi} ${student.last_name_hi}` 
    : `${student.first_name} ${student.last_name}`;

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold shadow-xs">
            {student.first_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
              {student.is_rte && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  RTE 12(1)(c)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {student.className} - {student.sectionName} • Roll #{student.roll_number}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <StatusChip status="present" locale={locale} />
        </div>
      </div>

      {/* 2-Column Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic & Personal Records */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1E3A8A]" />
            Academic & Identification Ledger
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.scholarId')}</span>
              <span className="font-mono font-bold text-slate-900">{student.admission_number}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.classSection')}</span>
              <span className="font-semibold text-slate-900">{student.className} - {student.sectionName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.dob')}</span>
              <span className="font-semibold text-slate-900">{student.date_of_birth}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.gender')}</span>
              <span className="font-semibold text-slate-900 capitalize">{student.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.bloodGroup')}</span>
              <span className="font-semibold text-slate-900">{student.blood_group || 'O+'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.category')}</span>
              <span className="font-semibold text-slate-900">{student.category}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.busRoute')}</span>
              <span className="font-semibold text-slate-900">{student.bus_route || 'Walking'}</span>
            </div>
          </div>
        </div>

        {/* Guardian & Contact Ledger */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1E3A8A]" />
            {t('student.guardianDetails')}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.fatherName')}</span>
              <span className="font-semibold text-slate-900">{student.guardianName || 'Ramesh Sharma'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Occupation</span>
              <span className="font-semibold text-slate-900">Civil Engineer • PWD Dept</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.emergencyContact')}</span>
              <span className="font-mono font-bold text-slate-900">{student.emergency_phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">{t('student.address')}</span>
              <span className="font-semibold text-slate-900 text-right max-w-[200px]">{student.address || 'Kalajharia, Jamtara'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading student profile...</div>}>
      <StudentProfileContent />
    </Suspense>
  );
}
