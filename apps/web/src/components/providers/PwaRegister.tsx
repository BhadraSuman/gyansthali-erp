'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('[PWA] Service worker registered with scope:', reg.scope))
          .catch((err) => console.log('[PWA] Service worker registration failed:', err));
      });
    }
  }, []);

  return null;
}
