import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockCalendarEvents } from './mockData';
import type { CalendarEvent } from '@gyansthali/api-types';

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });
    if (!error && data) return data as CalendarEvent[];
  }

  return mockCalendarEvents;
}
