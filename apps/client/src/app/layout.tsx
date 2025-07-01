import React from 'react';
import '../styles/globals.css';
import localFont from 'next/font/local';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AntdConfigProvider } from '../providers/antdConfigProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { AppSidebar } from '@client/components/common/sidebar/appSidebar';
import { PageLayout } from '@client/components/common/pageLayout';

const SFPro = localFont({
  src: '../../public/fonts/SF-Pro-Text-Regular.otf',
  variable: '--font-sf-pro',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`font-sf-pro antialiased  ${SFPro.variable} bg-background`}>
        <AntdRegistry>
          <AntdConfigProvider>
            <NextIntlClientProvider messages={messages}>
              <section className="flex items-start w-full">
                <aside className=" w-full !max-w-[246px] !overflow-hidden">
                  <AppSidebar />
                </aside>
                <PageLayout>{children}</PageLayout>
              </section>
            </NextIntlClientProvider>
          </AntdConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
