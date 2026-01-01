import type { Metadata } from 'next';
import './globals.css';
import DisclaimerModal from '@/components/DisclaimerModal';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rapid Response - Telehealth Demo',
  description: 'Secure telehealth platform demonstration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <DisclaimerModal />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}