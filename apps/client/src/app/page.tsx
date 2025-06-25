import { PageHeader } from '@workspace/ui/components/organisms/pageHeader';
import { PageLayout } from './_components/common/pageLayout';
import { FormModal } from '@workspace/ui/components/organisms/formModal';
import { useTranslations } from 'next-intl';
import { TableComponent } from './_components/common/table';

const Page = () => {
  const t = useTranslations();
  return (
    <PageLayout>
      <PageHeader
        titleKey="accountList"
        buttonLabelKey="add"
        modalKey={'add-user'}
        breadcrumbItems={[
          { title: '管理者', href: '/' },
          { title: 'アカウント管理', href: '/page' },
        ]}
      />
      <FormModal modalKey={'add-user'} formComponent={<div>hello</div>} title="アカウント管理" />
      <TableComponent />
    </PageLayout>
  );
};

export default Page;
