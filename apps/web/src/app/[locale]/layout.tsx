import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { AxeReporter } from '@/components/AxeReporter';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MANTIS — Stop guessing, start talking.',
    template: '%s | MANTIS',
  },
  description:
    'Connect instantly with vetted industry veterans and PhD researchers. Get the 1-on-1 mentorship you need to break through your blockers.',
  keywords: ['mentorship', 'mentor', 'learning', 'career', 'expert', 'coaching', 'online mentor'],
  authors: [{ name: 'MANTIS', url: 'https://mantis.com' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'MANTIS',
    title: 'MANTIS — Stop guessing, start talking.',
    description: 'Connect with expert mentors. 1-on-1 live mentorship sessions with escrow payments.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANTIS — Stop guessing, start talking.',
    description: 'Connect with expert mentors.',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="antialiased"
      >
        <NextIntlClientProvider messages={messages}>
          <AnalyticsProvider>
            {children}
            <AxeReporter />
          </AnalyticsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
