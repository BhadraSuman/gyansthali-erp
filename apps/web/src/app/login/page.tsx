'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Phone, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useRoleSession } from '@/components/providers/RoleSessionProvider';
import { signInWithOtp, verifyOtp, signInWithPassword } from '@/data/auth';
import type { UserRole } from '@gyansthali/api-types';

export default function LoginPage() {
  const router = useRouter();
  const { locale, t } = useLocale();
  const { setRole } = useRoleSession();

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  
  // OTP state
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [otpMessage, setOtpMessage] = useState('');

  // Password state
  const [email, setEmail] = useState('principal@gyansthali.edu');
  const [password, setPassword] = useState('password123');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    const res = await signInWithOtp(phoneNumber);
    setOtpSent(true);
    setOtpMessage(res.message);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyOtp(phoneNumber, otpToken || '123456');
    setRole('parent');
    router.push('/');
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await signInWithPassword(email, password);
    setRole(session.profile.role);
    router.push('/');
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setRole(role);
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2 rounded-2xl bg-blue-50 border border-blue-100 mb-1">
            <Image
              src="/logo.svg"
              alt="Gyan Sthali Crest"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-[#1E3A8A]">
            {t('auth.loginTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('otp'); setOtpSent(false); }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'otp'
                ? 'bg-white text-[#1E3A8A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('auth.parentStudentLogin')}
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMode === 'password'
                ? 'bg-white text-[#1E3A8A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('auth.staffLogin')}
          </button>
        </div>

        {/* OTP Auth Form */}
        {authMode === 'otp' ? (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('auth.phoneNumber')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                    placeholder={t('auth.phonePlaceholder')}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-xs"
              >
                {t('auth.sendOtp')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                {otpMessage}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('auth.enterOtp')}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center tracking-widest text-lg font-mono font-bold focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder={t('auth.otpPlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-xs"
              >
                {t('auth.verifyOtp')}
              </button>
            </form>
          )
        ) : (
          /* Password Form */
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1E3A8A] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#1E3A8A] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-xl bg-[#1E3A8A] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-xs"
            >
              {t('auth.signIn')}
            </button>
          </form>
        )}

        {/* 1-Click Quick Demo Switcher */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 text-center mb-3">
            {t('auth.quickDemoLogin')}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('parent')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-all text-left"
            >
              👨‍👩‍👧 Parent (Aarav&apos;s Dad)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('teacher')}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-bold transition-all text-left"
            >
              👩‍🏫 Teacher (Class 5-A)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold transition-all text-left"
            >
              🏛️ Admin (Principal)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold transition-all text-left"
            >
              👨‍🎓 Student (Aarav)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
