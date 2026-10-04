import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockNotices } from './mockData';
import type { Notice } from '@gyansthali/api-types';

export async function getNotices(audience?: string): Promise<Notice[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('notices').select('*').order('published_at', { ascending: false });
    if (audience && audience !== 'all') {
      query = query.or(`audience.eq.all,audience.eq.${audience}`);
    }
    const { data, error } = await query;
    if (!error && data) return data as Notice[];
  }

  if (audience && audience !== 'all') {
    return mockNotices.filter((n) => n.audience === 'all' || n.audience === audience);
  }
  return mockNotices;
}

export async function createNotice(notice: Omit<Notice, 'id' | 'created_at'>): Promise<Notice> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await (supabase.from('notices') as any)
      .insert(notice)
      .select()
      .single();
    if (error) throw error;
    return data as Notice;
  }

  const newNotice: Notice = {
    ...notice,
    id: `not-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  mockNotices.unshift(newNotice);
  return newNotice;
}
