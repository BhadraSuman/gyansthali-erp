import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStudents } from './mockData';
import type { StudentWithClass } from '@gyansthali/api-types';

export async function getStudents(): Promise<StudentWithClass[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('v_student_directory' as any)
      .select('*');
    if (error) throw error;
    return (data as any) || [];
  }

  return mockStudents;
}

export async function getStudentById(studentId: string): Promise<StudentWithClass | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('v_student_directory' as any)
      .select('*')
      .eq('id', studentId)
      .single();
    if (error) return null;
    return (data as any) || null;
  }

  return mockStudents.find((s) => s.id === studentId) || mockStudents[0] || null;
}

export async function getParentChildren(parentProfileId?: string): Promise<StudentWithClass[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        sections (name, classes (name)),
        student_guardians!inner (
          guardians!inner (profile_id)
        )
      `)
      .eq('student_guardians.guardians.profile_id', parentProfileId || '');
    if (!error && data) {
      return data as any;
    }
  }

  // Demo: Ramesh Sharma has two children: Aarav (Roll 1) and Ananya (Roll 6)
  return mockStudents.filter((s) => s.id === 'std00000-0000-0000-0000-000000000001' || s.id === 'std00000-0000-0000-0000-000000000006');
}
