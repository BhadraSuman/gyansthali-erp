import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockTimetable } from './mockData';
import type { TimetableSlot } from '@gyansthali/api-types';

export async function getSectionTimetable(sectionId?: string, dayOfWeek: number = 1): Promise<TimetableSlot[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('timetables')
      .select(`
        period_number,
        start_time,
        end_time,
        subjects (name),
        staff (profiles (full_name))
      `)
      .eq('day_of_week', dayOfWeek)
      .order('period_number', { ascending: true });
    if (!error && data) {
      return (data as any[]).map((t) => ({
        periodNumber: t.period_number,
        startTime: t.start_time.slice(0, 5),
        endTime: t.end_time.slice(0, 5),
        subjectName: t.subjects?.name || 'Class',
        teacherName: t.staff?.profiles?.full_name || 'Staff',
      }));
    }
  }

  return mockTimetable;
}
