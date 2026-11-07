import { ServiceWorkerRegister } from '@/components/service-worker-register';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'MEDSPACE',
  description: 'Arabic-first academic platform for a private human medicine cohort.',
  manifest: '/manifest.webmanifest',
  themeColor: '#0d6fe8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100"><ThemeProvider>{children}<ServiceWorkerRegister /></ThemeProvider></body></html>;
}
