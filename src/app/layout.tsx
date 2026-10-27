import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'TallyUP — The Decent Work Platform & Tamper-Evident Pocket Witness',
  description: 'UN SDG 8 Platform: Tamper-evident attendance, voice payslip audits, multimodal hazard triage, and safe anonymous worker voice.',
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
        <meta name="theme-color" content="#009999" />
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
