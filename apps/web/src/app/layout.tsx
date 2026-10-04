import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { RoleSessionProvider } from '@/components/providers/RoleSessionProvider';
import { Header } from '@/components/shell/Header';
import { ChildSwitcher } from '@/components/shell/ChildSwitcher';
import { BottomNav } from '@/components/shell/BottomNav';
import { AdminSidebar } from '@/components/shell/AdminSidebar';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hindi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gyan Sthali Public School ERP — Kalajharia',
  description: 'Unified School Management, Parent/Teacher Portal & Learning Platform for Gyan Sthali Public School, Kalajharia, Karmatanr, Jamtara.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#1E3A8A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${notoDevanagari.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#F6F7FB] text-[#0F172A] antialiased pb-16 lg:pb-0">
        <QueryProvider>
          <LocaleProvider>
            <RoleSessionProvider>
              <Header />
              <ChildSwitcher />
              <div className="flex-1 flex max-w-7xl w-full mx-auto">
                <AdminSidebar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                  {children}
                </main>
              </div>
              <BottomNav />
            </RoleSessionProvider>
          </LocaleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
