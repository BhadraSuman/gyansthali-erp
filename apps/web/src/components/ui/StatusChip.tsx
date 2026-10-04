import React from 'react';
import type { AttendanceStatus, FeeStatus } from '@gyansthali/api-types';
import { cn } from '@/lib/utils';

interface StatusChipProps {
  status: AttendanceStatus | FeeStatus | 'submitted' | 'graded';
  locale?: 'en' | 'hi';
  className?: string;
}

export function StatusChip({ status, locale = 'en', className }: StatusChipProps) {
  switch (status) {
    case 'present':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800', className)}>
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          {locale === 'hi' ? 'उपस्थित' : 'Present'}
        </span>
      );
    case 'absent':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800', className)}>
          <span className="w-2 h-2 rounded-full bg-red-600" />
          {locale === 'hi' ? 'अनुपस्थित' : 'Absent'}
        </span>
      );
    case 'late':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900', className)}>
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          {locale === 'hi' ? 'विलंब' : 'Late'}
        </span>
      );
    case 'paid':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800', className)}>
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          {locale === 'hi' ? 'भुगतान पूर्ण' : 'Clear / Paid'}
        </span>
      );
    case 'partial':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800', className)}>
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          {locale === 'hi' ? 'आंशिक भुगतान' : 'Partially Paid'}
        </span>
      );
    case 'overdue':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800', className)}>
          <span className="w-2 h-2 rounded-full bg-rose-600" />
          {locale === 'hi' ? 'अतिदेय' : 'Overdue'}
        </span>
      );
    case 'submitted':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800', className)}>
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          {locale === 'hi' ? 'जमा किया' : 'Submitted'}
        </span>
      );
    case 'graded':
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800', className)}>
          <span className="w-2 h-2 rounded-full bg-purple-600" />
          {locale === 'hi' ? 'मूल्यांकित' : 'Graded'}
        </span>
      );
    default:
      return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800', className)}>
          {status}
        </span>
      );
  }
}
