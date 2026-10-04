'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMessages, type Messages } from '@gyansthali/i18n';

interface LocaleContextType {
  locale: 'en' | 'hi';
  setLocale: (loc: 'en' | 'hi') => void;
  messages: Messages;
  t: (keyPath: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<'en' | 'hi'>('en');
  const [messages, setMessages] = useState<Messages>(getMessages('en'));

  useEffect(() => {
    const saved = localStorage.getItem('gyansthali_locale') as 'en' | 'hi' | null;
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLocaleState(saved);
      setMessages(getMessages(saved));
    }
  }, []);

  const setLocale = (loc: 'en' | 'hi') => {
    setLocaleState(loc);
    setMessages(getMessages(loc));
    localStorage.setItem('gyansthali_locale', loc);
  };

  const t = (keyPath: string): string => {
    const parts = keyPath.split('.');
    let current: any = messages;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return keyPath;
      }
    }
    return typeof current === 'string' ? current : keyPath;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
