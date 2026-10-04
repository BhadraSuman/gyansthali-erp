'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Receipt, 
  Calendar, 
  Bell, 
  BookOpen, 
  Bus,
  Settings,
  GraduationCap,
  Layers
} from 'lucide-react';
import { useLocale } from '../providers/LocaleProvider';
import { useRoleSession } from '../providers/RoleSessionProvider';

export function AdminSidebar() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const { role } = useRoleSession();

  if (role !== 'admin') {
    return null;
  }

  const sections = [
    {
      titleEn: 'Core',
      titleHi: 'मुख्य',
      items: [
        { href: '/', labelEn: 'Executive Dashboard', labelHi: 'डैशबोर्ड', icon: LayoutDashboard },
        { href: '/portal/students', labelEn: 'Students Directory', labelHi: 'छात्र निर्देशिका', icon: Users },
        { href: '/portal/admin/academics', labelEn: 'Academics & Classes', labelHi: 'शैक्षणिक संरचना', icon: Layers },
        { href: '/portal/admin/staff', labelEn: 'Staff & Teachers', labelHi: 'शिक्षक व स्टाफ', icon: Users },
        { href: '/portal/attendance', labelEn: 'Attendance & Leaves', labelHi: 'उपस्थिति', icon: CalendarCheck },
      ],
    },
    {
      titleEn: 'Academic & Ops',
      titleHi: 'शैक्षणिक व संचालन',
      items: [
        { href: '/portal/timetable', labelEn: 'Timetable Builder', labelHi: 'समय-सारणी', icon: Calendar },
        { href: '/portal/homework', labelEn: 'Homework & Syllabus', labelHi: 'गृहकार्य', icon: BookOpen },
        { href: '/portal/fees', labelEn: 'Fees & Billing', labelHi: 'शुल्क प्रबंधन', icon: Receipt },
        { href: '/portal/calendar', labelEn: 'Calendar & Events', labelHi: 'वार्षिक कैलेंडर', icon: GraduationCap },
      ],
    },
    {
      titleEn: 'Communication',
      titleHi: 'संचार',
      items: [
        { href: '/portal/notices', labelEn: 'Notices & Circulars', labelHi: 'परिपत्र व सूचनाएं', icon: Bell },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="flex-1 space-y-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
              {locale === 'hi' ? sec.titleHi : sec.titleEn}
            </span>
            <div className="space-y-0.5 pt-1">
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                const label = locale === 'hi' ? item.labelHi : item.labelEn;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-medium">UDISE Record</span>
            <span className="text-xs font-bold text-[#1E3A8A]">#20191509702</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="System Verified" />
        </div>
      </div>
    </aside>
  );
}
