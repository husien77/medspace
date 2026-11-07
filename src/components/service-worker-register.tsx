'use client';

import { useEffect, useState } from 'react';

export function ServiceWorkerRegister() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true); const off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch((error) => console.error('Service worker registration failed', error));
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return <div aria-live="polite" className={`fixed bottom-3 left-3 z-50 rounded-full px-3 py-1 text-xs font-bold shadow ${online ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{online ? 'متصل' : 'غير متصل'}</div>;
}
