import React from 'react';
import '../styles/globals.css';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import localFont from 'next/font/local';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { AntdConfigProvider } from '../providers/antdConfigProvider';
import { AppSidebar } from '@workspace/ui/components/organisms/sidebar/appSidebar';



const sfPro = localFont({
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`font-sf-pro antialiased  ${sfPro.variable} bg-background`}
      >
        <AntdRegistry>
          <AntdConfigProvider>
            <section className="flex items-start w-full">
              <aside className=" w-full !max-w-[246px] !overflow-hidden">
                <AppSidebar />
              </aside>
              <div className="w-full layout-width h-[99vh] !overflow-y-auto">{children}</div>
            </section>
          </AntdConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
