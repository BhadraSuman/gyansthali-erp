'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, Plus, Upload, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { getHomework, createHomework, type HomeworkWithSubject } from '@/data/homework';
import { formatDate } from '@/lib/utils';
import { StatusChip } from '@/components/ui/StatusChip';

export default function HomeworkPage() {
  const { locale, t } = useLocale();
  const { role, activeChild } = useRoleSession();
  const [homeworkList, setHomeworkList] = useState<HomeworkWithSubject[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectName, setSubjectName] = useState('Mathematics');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    getHomework(activeChild.section_id).then(setHomeworkList);
  }, [activeChild.section_id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate) return;

    const created = await createHomework({
      section_id: activeChild.section_id,
      subject_id: 'sub00000-0000-0000-0000-000000000001',
      teacher_id: 'st000000-0000-0000-0000-000000000001',
      title,
      description,
      due_date: dueDate,
      attachment_url: null,
      subjectName,
      teacherName: 'Sunita Mishra',
    });

    setHomeworkList([created, ...homeworkList]);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t('homework.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeChild.className} - {activeChild.sectionName} • {t('homework.subtitle')}
          </p>
        </div>

        {(role === 'teacher' || role === 'admin') && (
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-xs hover:bg-blue-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('homework.createHomework')}
          </button>
        )}
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeworkList.map((hw) => (
          <div key={hw.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#1E3A8A] text-xs font-bold">
                  {hw.subjectName}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Due: {formatDate(hw.due_date, locale)}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 mt-3">
                {hw.title}
              </h2>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {hw.description}
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Assigned by: <span className="font-semibold text-slate-700">{hw.teacherName}</span>
              </span>

              {role === 'parent' || role === 'student' ? (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {t('homework.uploadWork')}
                </button>
              ) : (
                <StatusChip status="submitted" locale={locale} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {t('homework.createHomework')}
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Environmental Studies">Environmental Studies</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  placeholder="e.g. Chapter 7: Decimals Exercise"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Instructions *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  placeholder="Specify page numbers, questions, and submission requirements..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900"
                >
                  {t('common.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
