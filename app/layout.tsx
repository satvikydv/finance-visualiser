import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layout/main-layout';
import { CurrencyProvider } from '@/hooks/useCurrency';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Personal Finance Visualizer',
  description: 'Track your expenses, manage budgets, and visualize your financial health',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CurrencyProvider>
          <MainLayout>{children}</MainLayout>
        </CurrencyProvider>
      </body>
    </html>
  );
}