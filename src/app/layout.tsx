import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'TallyUP — Every Hour Counts. Count It. Prove It. Get Paid.',
  description: 'UN SDG 8 Decent Work Platform: Tamper-evident attendance ledger, Wage Guardian audio audit, multimodal hazard triage, and Safe Voice identity scrubber.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#08090a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
