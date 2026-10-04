'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Coffee } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { getSectionTimetable } from '@/data/timetable';
import type { TimetableSlot } from '@gyansthali/api-types';

export default function TimetablePage() {
  const { locale, t } = useLocale();
  const { activeChild } = useRoleSession();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);

  const days = [
    { day: 1, nameEn: 'Monday', nameHi: 'सोमवार' },
    { day: 2, nameEn: 'Tuesday', nameHi: 'मंगलवार' },
    { day: 3, nameEn: 'Wednesday', nameHi: 'बुधवार' },
    { day: 4, nameEn: 'Thursday', nameHi: 'गुरुवार' },
    { day: 5, nameEn: 'Friday', nameHi: 'शुक्रवार' },
    { day: 6, nameEn: 'Saturday', nameHi: 'शनिवार' },
  ];

  useEffect(() => {
    getSectionTimetable(activeChild.section_id, selectedDay).then(setSlots);
  }, [activeChild.section_id, selectedDay]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t('timetable.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeChild.className} - {activeChild.sectionName} (Room 204) • {t('timetable.subtitle')}
          </p>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((d) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setSelectedDay(d.day)}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedDay === d.day
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {locale === 'hi' ? d.nameHi : d.nameEn}
          </button>
        ))}
      </div>

      {/* Periods Timeline Grid */}
      <div className="space-y-3">
        {slots.map((slot, index) => {
          if (slot.isRecess) {
            return (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-amber-900"
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {t('timetable.recess')}
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] font-bold text-sm flex items-center justify-center shrink-0">
                  #{slot.periodNumber}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{slot.subjectName}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {slot.teacherName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {slot.roomNumber || 'Room 204'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{slot.startTime} - {slot.endTime}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
