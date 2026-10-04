import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockProfiles } from './mockData';
import type { Profile, UserRole } from '@gyansthali/api-types';

export interface AuthSession {
  user: {
    id: string;
    phone?: string;
    email?: string;
  };
  profile: Profile;
}

export async function getCurrentUserProfile(role: UserRole = 'parent'): Promise<Profile> {
  if (isSupabaseConfigured && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) return data;
    }
  }

  // Fallback to role-specific mock profile
  return mockProfiles[role] || mockProfiles.parent;
}

export async function signInWithOtp(phone: string): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
    if (error) throw error;
    return { success: true, message: 'OTP sent to mobile number' };
  }
  // Demo simulate OTP send
  return { success: true, message: `Demo OTP sent to ${phone}: Use 123456` };
}

export async function verifyOtp(phone: string, token: string): Promise<AuthSession> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token,
      type: 'sms',
    });
    if (error) throw error;
    const profile = await getCurrentUserProfile('parent');
    return {
      user: { id: data.user!.id, phone: data.user!.phone },
      profile,
    };
  }

  // Demo verify
  return {
    user: { id: mockProfiles.parent.id, phone },
    profile: mockProfiles.parent,
  };
}

export async function signInWithPassword(email: string, password: string): Promise<AuthSession> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profile = await getCurrentUserProfile('teacher');
    return {
      user: { id: data.user!.id, email: data.user!.email },
      profile,
    };
  }

  // Demo password sign-in
  const role: UserRole = email.includes('principal') ? 'admin' : 'teacher';
  return {
    user: { id: mockProfiles[role].id, email },
    profile: mockProfiles[role],
  };
}
