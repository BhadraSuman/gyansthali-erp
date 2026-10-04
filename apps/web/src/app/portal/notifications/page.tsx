'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, BookOpen, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { getNotifications, markNotificationAsRead, type InAppNotification } from '@/data/notifications';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { locale, t } = useLocale();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const handleRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'absence_alert':
        return <div className="p-2 rounded-xl bg-red-100 text-red-700 shrink-0"><AlertTriangle className="w-4 h-4" /></div>;
      case 'new_homework':
        return <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0"><BookOpen className="w-4 h-4" /></div>;
      case 'new_notice':
        return <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0"><Bell className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0"><FileText className="w-4 h-4" /></div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t('common.notifications')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {locale === 'hi' ? 'दैनिक उपस्थिति अलर्ट, नया गृहकार्य एवं आधिकारिक परिपत्र' : 'Real-time alerts, daily absence notifications, and official circulars'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const title = locale === 'hi' && notif.titleHi ? notif.titleHi : notif.title;
          const body = locale === 'hi' && notif.bodyHi ? notif.bodyHi : notif.body;

          return (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-white border-slate-200'
                  : 'bg-blue-50/40 border-blue-200 shadow-xs ring-1 ring-blue-100'
              }`}
            >
              {getCategoryIcon(notif.category)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {title}
                  </h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {formatDate(notif.createdAt, locale)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {body}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  {notif.actionUrl && (
                    <Link
                      href={notif.actionUrl}
                      onClick={() => handleRead(notif.id)}
                      className="text-xs font-semibold text-[#1E3A8A] hover:underline flex items-center gap-1"
                    >
                      <span>{t('common.viewDetails')}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => handleRead(notif.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      {locale === 'hi' ? 'पढ़ा हुआ चिह्नित करें' : 'Mark as read'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
