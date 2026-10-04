'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarCheck, BookOpen, Bell, Calendar, User, FileText } from 'lucide-react';
import { useLocale } from '../providers/LocaleProvider';
import { useRoleSession } from '../providers/RoleSessionProvider';

export function BottomNav() {
  const pathname = usePathname();
  const { t, locale } = useLocale();
  const { role } = useRoleSession();

  // On desktop admin view, sidebar handles navigation instead
  if (role === 'admin' && typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return null;
  }

  const navItems = [
    { href: '/', labelEn: 'Home', labelHi: 'होम', icon: Home },
    { href: '/portal/attendance', labelEn: 'Attendance', labelHi: 'उपस्थिति', icon: CalendarCheck },
    { href: '/portal/homework', labelEn: 'Homework', labelHi: 'गृहकार्य', icon: BookOpen },
    { href: '/portal/notices', labelEn: 'Notices', labelHi: 'सूचनाएं', icon: Bell },
    { href: '/portal/timetable', labelEn: 'Timetable', labelHi: 'समय-सारणी', icon: Calendar },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-bottom shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const label = locale === 'hi' ? item.labelHi : item.labelEn;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
                isActive
                  ? 'text-[#1E3A8A] font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-1 truncate max-w-[64px]">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
