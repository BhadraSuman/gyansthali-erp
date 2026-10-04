'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Download, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { getStudentFees, type FeeSummary } from '@/data/fees';
import { StatusChip } from '@/components/ui/StatusChip';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function FeesPage() {
  const { locale, t } = useLocale();
  const { activeChild, role } = useRoleSession();
  const [feeSummary, setFeeSummary] = useState<FeeSummary>({
    totalBilled: 19350,
    totalPaid: 12900,
    balanceDue: 6450,
    invoices: [],
  });

  useEffect(() => {
    getStudentFees(activeChild.id).then(setFeeSummary);
  }, [activeChild.id]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t('fees.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeChild.first_name} {activeChild.last_name} • {t('fees.subtitle')}
          </p>
        </div>

        {feeSummary.balanceDue > 0 && (
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            {t('fees.payNow')} ({formatCurrency(feeSummary.balanceDue)})
          </button>
        )}
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Billed (AY 2024-25)</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(feeSummary.totalBilled)}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Quarterly Fee Structure</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">{t('fees.paid')}</span>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{formatCurrency(feeSummary.totalPaid)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Verified via Bank / Online</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">{t('fees.totalDue')}</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">{formatCurrency(feeSummary.balanceDue)}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Due before Nov 10, 2024</span>
        </div>
      </div>

      {/* Invoices Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Quarterly Invoices & Payment Clearance
        </h2>

        <div className="divide-y divide-slate-100">
          {feeSummary.invoices.map((inv) => (
            <div key={inv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    Session 2024-25 — {inv.quarter} Tuition & Facility Fee
                  </span>
                  <StatusChip status={inv.status} locale={locale} />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Due Date: {formatDate(inv.due_date, locale)} • Total: {formatCurrency(inv.total_amount)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-mono text-slate-900">
                  {formatCurrency(inv.paid_amount)} / {formatCurrency(inv.total_amount)}
                </span>
                {inv.status === 'paid' && (
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
                    title="Download Receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
