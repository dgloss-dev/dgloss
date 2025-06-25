import React from 'react';
import { getTranslations } from 'next-intl/server';
import { TopPageHeader } from '@client/components/common/header';
import { ROUTES } from '@client/constants/routes.constant';
import { OPERATOR_STATE } from '@workspace/types/enums/operatorStatus/operatorState.enum';

interface PageLayoutProps {
  children: React.ReactNode;
}
export const PageLayout = async ({ children }: PageLayoutProps) => {
  const t = await getTranslations('common');
  return (
    <section className=" bg-primary w-full h-full min-h-screen">
      <TopPageHeader status={OPERATOR_STATE.SEATED} faqRoute={ROUTES.FAQ} />
      <div className="w-full h-full px-8 ">{children}</div>
    </section>
  );
};
