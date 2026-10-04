'use client';

import React from 'react';
import { useRoleSession } from '../providers/RoleSessionProvider';
import { useLocale } from '../providers/LocaleProvider';
import { User } from 'lucide-react';

export function ChildSwitcher() {
  const { role, parentChildren, activeChild, setActiveChildId } = useRoleSession();
  const { locale } = useLocale();

  if (role !== 'parent' || parentChildren.length <= 1) {
    return null;
  }

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1">
          {locale === 'hi' ? 'बच्चा चुनें:' : 'Student:'}
        </span>
        {parentChildren.map((child) => {
          const isActive = child.id === activeChild.id;
          const displayName = locale === 'hi' && child.first_name_hi 
            ? `${child.first_name_hi} - कक्षा 5-A`
            : `${child.first_name} - Class 5-A`;

          return (
            <button
              key={child.id}
              type="button"
              onClick={() => setActiveChildId(child.id)}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#1E3A8A] text-white shadow-xs ring-2 ring-[#F59E0B]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-[#F59E0B] text-slate-900' : 'bg-slate-200 text-slate-700'
              }`}>
                {child.first_name.charAt(0)}
              </div>
              <span>{displayName}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                #{child.roll_number}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
