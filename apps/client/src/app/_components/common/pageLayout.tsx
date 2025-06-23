import React from 'react';
import { getTranslations } from 'next-intl/server';
import { TopPageHeader } from '@workspace/ui/components/organisms/pageHeader';
import { ROUTES } from '@client/constants';

export type OperatorStatus = 'seated' | 'away';
interface PageLayoutProps {
  children: React.ReactNode;
}
export const PageLayout = async ({ children }: PageLayoutProps) => {
  const t = await getTranslations('common');
  return (
    <section className=" bg-primary w-full h-full min-h-screen">
      <TopPageHeader status={'seated'} faqRoute={ROUTES.FAQ} />
      <div className="w-full h-full px-8 ">{children}</div>
    </section>
  );
};
