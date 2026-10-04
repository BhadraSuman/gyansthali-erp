'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, PartyPopper, BookOpen, Users, AlertCircle } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getCalendarEvents } from '@/data/calendar';
import { formatDate } from '@/lib/utils';
import type { CalendarEvent } from '@gyansthali/api-types';

export default function CalendarEventsPage() {
  const { locale, t } = useLocale();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    getCalendarEvents().then(setEvents);
  }, []);

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'holiday':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">{t('calendar.holiday')}</span>;
      case 'exam':
        return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">{t('calendar.exam')}</span>;
      case 'celebration':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{t('calendar.celebration')}</span>;
      case 'meeting':
        return <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">{t('calendar.meeting')}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">{type}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">
          {t('calendar.title')}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('calendar.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {events.map((ev) => {
          const title = locale === 'hi' && ev.title_hi ? ev.title_hi : ev.title;

          return (
            <div key={ev.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getEventBadge(ev.event_type)}
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 capitalize">Audience: {ev.audience}</span>
                </div>

                <h2 className="text-base font-bold text-slate-900">
                  {title}
                </h2>

                {ev.description && (
                  <p className="text-xs text-slate-600">
                    {ev.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 shrink-0 self-start sm:self-auto">
                <Calendar className="w-4 h-4 text-[#1E3A8A]" />
                <span>
                  {formatDate(ev.start_date, locale)}
                  {ev.start_date !== ev.end_date && ` - ${formatDate(ev.end_date, locale)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
