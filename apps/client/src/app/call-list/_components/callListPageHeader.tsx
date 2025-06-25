import { PageHeader } from '@client/components/common/header';
import { ROUTES } from '@client/constants/routes.constant';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

export const CallListPageHeader = () => {
  const t = useTranslations('common');

  const breadcrumbItems: any = [
    {
      title: (
        <Link href={`${ROUTES.HOME}`} prefetch={false}>
          {t('breadcrumb.manager')}
        </Link>
      ),
    },
    {
      title: t('breadcrumb.callList'),
    },
  ];
  return (
    <>
      <PageHeader
        titleKey="callList"
        buttonLabelKey="add"
        modalKey="callList"
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
};
