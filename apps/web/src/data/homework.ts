import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockHomework } from './mockData';
import type { Homework } from '@gyansthali/api-types';

export interface HomeworkWithSubject extends Homework {
  subjectName: string;
  teacherName: string;
}

export async function getHomework(sectionId?: string): Promise<HomeworkWithSubject[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('homework')
      .select(`
        *,
        subjects (name),
        staff (profiles (full_name))
      `)
      .order('due_date', { ascending: true });
    if (!error && data) {
      return (data as any[]).map((h) => ({
        ...h,
        subjectName: h.subjects?.name || 'Subject',
        teacherName: h.staff?.profiles?.full_name || 'Teacher',
      }));
    }
  }

  return mockHomework;
}

export async function createHomework(
  hw: Omit<Homework, 'id' | 'created_at'> & { subjectName: string; teacherName: string }
): Promise<HomeworkWithSubject> {
  if (isSupabaseConfigured && supabase) {
    const { subjectName, teacherName, ...dbPayload } = hw;
    const { data, error } = await (supabase.from('homework') as any)
      .insert(dbPayload)
      .select()
      .single();
    if (error) throw error;
    return { ...data, subjectName, teacherName } as HomeworkWithSubject;
  }

  const newHw: HomeworkWithSubject = {
    ...hw,
    id: `hw-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  mockHomework.unshift(newHw);
  return newHw;
}
