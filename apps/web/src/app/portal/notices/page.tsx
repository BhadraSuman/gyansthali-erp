'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Download, Pin, Filter, Calendar } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { getNotices, createNotice } from '@/data/notices';
import { formatDate } from '@/lib/utils';
import type { Notice, NoticeCategory, NoticePriority, NoticeAudience } from '@gyansthali/api-types';

export default function NoticesPage() {
  const { locale, t } = useLocale();
  const { role, profile } = useRoleSession();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filterAudience, setFilterAudience] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newContentHi, setNewContentHi] = useState('');
  const [newCategory, setNewCategory] = useState<NoticeCategory>('academic');
  const [newPriority, setNewPriority] = useState<NoticePriority>('normal');
  const [newAudience, setNewAudience] = useState<NoticeAudience>('all');

  useEffect(() => {
    getNotices(filterAudience).then(setNotices);
  }, [filterAudience]);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const created = await createNotice({
      title: newTitle,
      title_hi: newTitleHi || null,
      content: newContent,
      content_hi: newContentHi || null,
      category: newCategory,
      priority: newPriority,
      audience: newAudience,
      target_class_id: null,
      attachment_url: null,
      published_by: profile.id,
      published_at: new Date().toISOString(),
    });

    setNotices([created, ...notices]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t('notices.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('notices.subtitle')}
          </p>
        </div>

        {(role === 'admin' || role === 'teacher') && (
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-xs hover:bg-blue-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('notices.postNotice')}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'parents', 'teachers', 'students'].map((aud) => (
          <button
            key={aud}
            type="button"
            onClick={() => setFilterAudience(aud)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
              filterAudience === aud
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {aud === 'all' ? t('notices.allAudiences') : aud}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => {
          const isUrgent = notice.priority === 'urgent';
          const title = locale === 'hi' && notice.title_hi ? notice.title_hi : notice.title;
          const content = locale === 'hi' && notice.content_hi ? notice.content_hi : notice.content;

          return (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs transition-all ${
                isUrgent ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {isUrgent && (
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      {t('notices.urgent')}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {notice.category}
                  </span>
                  <span className="text-[11px] text-slate-400">•</span>
                  <span className="text-[11px] text-slate-500 capitalize">
                    Audience: {notice.audience}
                  </span>
                </div>

                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(notice.published_at, locale)}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-2.5">
                {title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                {content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating Notice */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {t('notices.postNotice')}
            </h3>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder="e.g. CBSE Examination Schedule"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Title (हिन्दी - Optional)
                </label>
                <input
                  type="text"
                  value={newTitleHi}
                  onChange={(e) => setNewTitleHi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder="उदा. सीबीएसई परीक्षा समय-सारणी"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Content (English) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder="Detailed broadcast text..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as NoticePriority)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Audience</label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value as NoticeAudience)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="all">All</option>
                    <option value="parents">Parents</option>
                    <option value="teachers">Teachers</option>
                    <option value="students">Students</option>
                  </select>
                </div>
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
