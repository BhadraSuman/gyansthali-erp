'use client';

import React, { useState } from 'react';
import { GraduationCap, Plus, BookOpen, Layers, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { mockAcademicYears, mockClasses, type ClassConfig } from '@/data/admin';

export default function AdminAcademicsPage() {
  const { locale } = useLocale();
  const [classes, setClasses] = useState<ClassConfig[]>(mockClasses);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    const newClass: ClassConfig = {
      id: `c-${Date.now()}`,
      name: newClassName,
      orderIndex: classes.length + 1,
      sections: [{ id: `sec-${Date.now()}`, name: 'A', roomNumber: `Room 20${classes.length + 5}` }],
      subjects: [
        { id: `sub-${Date.now()}-1`, name: 'Mathematics', code: `MATH-${classes.length + 1}` },
        { id: `sub-${Date.now()}-2`, name: 'Hindi', code: `HIN-${classes.length + 1}` },
        { id: `sub-${Date.now()}-3`, name: 'English', code: `ENG-${classes.length + 1}` },
      ],
    };

    setClasses([...classes, newClass]);
    setNewClassName('');
    setShowAddClass(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Administrative Management
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Academic Structure & Curricula Setup
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic sessions, classes, sections, and subject syllabi allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddClass(true)}
          className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-xs hover:bg-blue-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Class
        </button>
      </div>

      {/* Academic Year Selector Strip */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E3A8A]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Current Academic Session</h2>
            <p className="text-xs text-slate-500">April 1, 2024 to March 31, 2025</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mockAcademicYears.map((ay) => (
            <span
              key={ay.id}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                ay.isCurrent
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {ay.isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              {ay.name} {ay.isCurrent && '(Active)'}
            </span>
          ))}
        </div>
      </div>

      {/* Classes & Sections Matrix */}
      <div className="space-y-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-slate-500">
                    {cls.sections.length} Active Section{cls.sections.length > 1 ? 's' : ''} • {cls.subjects.length} Subjects
                  </p>
                </div>
              </div>
            </div>

            {/* Sections Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cls.sections.map((sec) => (
                <div key={sec.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Section {sec.name}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{sec.roomNumber}</p>
                  </div>
                  {sec.classTeacher && (
                    <span className="text-[11px] font-semibold text-blue-700 px-2 py-0.5 rounded bg-blue-100">
                      {sec.classTeacher}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Subjects Pill Row */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 mr-1">Curriculum:</span>
              {cls.subjects.map((sub) => (
                <span
                  key={sub.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-slate-400" />
                  <span>{sub.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({sub.code})</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Class 7"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
