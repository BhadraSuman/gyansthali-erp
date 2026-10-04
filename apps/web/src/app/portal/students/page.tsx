'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Bus, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpDown,
  Download,
  UserPlus
} from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { StatusChip } from '@/components/ui/StatusChip';
import { getStudents } from '@/data/students';
import { formatCurrency } from '@/lib/utils';
import type { StudentWithClass } from '@gyansthali/api-types';

export default function StudentsDirectoryPage() {
  const { locale, t } = useLocale();
  const { role } = useRoleSession();
  const [students, setStudents] = useState<StudentWithClass[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admission_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.guardianName && s.guardianName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'rte' && s.is_rte) ||
      (categoryFilter === 'bus' && s.bus_route && !s.bus_route.includes('Walking')) ||
      (categoryFilter === 'low_att' && (s.attendancePct || 100) < 75);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1E3A8A] text-xs font-bold uppercase tracking-wider">
              CBSE Affiliation #3430198
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Academic Session 2024-25</span>
          </div>
          <h1 className="text-xl font-bold text-[#1E3A8A] mt-2">
            Student Master Directory • {locale === 'hi' ? 'छात्र निर्देशिका' : 'छात्र निर्देशिका'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive enrollment registers, biometric thresholds, and parent contact ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            CSV Export
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900 transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            + New Admission
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, Hindi name, scholar ID (GSPS-), or guardian..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1E3A8A] outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Students ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('rte')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                categoryFilter === 'rte'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              RTE Beneficiaries
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('bus')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                categoryFilter === 'bus'
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bus Commuters
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('low_att')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer ${
                categoryFilter === 'low_att'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 text-red-700 hover:bg-red-50'
              }`}
            >
              Low Attendance (&lt;75%)
            </button>
          </div>
        </div>
      </div>

      {/* Dense Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Student & Scholar ID</th>
                <th className="py-3.5 px-4">Class & Roll</th>
                <th className="py-3.5 px-4">Parent & Contact</th>
                <th className="py-3.5 px-4">Attendance (YTD)</th>
                <th className="py-3.5 px-4">Fee Clearance</th>
                <th className="py-3.5 px-4">Transport</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((std) => {
                const displayName = locale === 'hi' && std.first_name_hi 
                  ? `${std.first_name_hi} ${std.last_name_hi}` 
                  : `${std.first_name} ${std.last_name}`;

                return (
                  <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-white font-bold flex items-center justify-center shrink-0">
                          {std.first_name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{displayName}</span>
                            {std.is_rte && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                RTE
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {std.admission_number} • {std.blood_group || 'O+'} • {std.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Class & Roll */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{std.className} - {std.sectionName}</span>
                      <div className="text-[11px] text-slate-500">Roll #{std.roll_number}</div>
                    </td>

                    {/* Parent & Contact */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{std.guardianName || 'Guardian'}</span>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{std.guardianPhone || std.emergency_phone}</span>
                      </div>
                    </td>

                    {/* Attendance */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          (std.attendancePct || 90) >= 75 ? 'text-slate-900' : 'text-red-600'
                        }`}>
                          {std.attendancePct || 90}%
                        </span>
                        {(std.attendancePct || 90) >= 75 ? (
                          <span className="text-[10px] text-emerald-600 font-semibold">Eligible</span>
                        ) : (
                          <span className="text-[10px] text-red-600 font-semibold">Alert &lt;75%</span>
                        )}
                      </div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            (std.attendancePct || 90) >= 75 ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${std.attendancePct || 90}%` }}
                        />
                      </div>
                    </td>

                    {/* Fee Clearance */}
                    <td className="py-3.5 px-4">
                      {(std.totalFeeDue || 0) === 0 ? (
                        <StatusChip status="paid" locale={locale} />
                      ) : (
                        <div>
                          <StatusChip status="overdue" locale={locale} />
                          <div className="text-[11px] font-mono text-red-600 mt-0.5">
                            {formatCurrency(std.totalFeeDue || 0)} Due
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Transport */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Bus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate max-w-[140px]">{std.bus_route || 'Walking'}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/portal/student?id=${std.id}`}
                        className="text-xs font-semibold text-[#1E3A8A] hover:underline"
                      >
                        360° Profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
