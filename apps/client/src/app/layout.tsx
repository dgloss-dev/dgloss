import React from 'react';
import '../styles/globals.css';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AntdConfigProvider } from '../providers/antdConfigProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata = {
  title: 'Dgloss',
  description: 'Dgloss AI Call Center',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`font-sans antialiased ${inter.variable} ${notoSans.variable} bg-background`}
      >
        <AntdRegistry>
          <AntdConfigProvider>
            <div className="min-h-screen bg-gray-50">
              <main className="">
                <div className="mx-auto w-full">{children}</div>
              </main>
            </div>
          </AntdConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
