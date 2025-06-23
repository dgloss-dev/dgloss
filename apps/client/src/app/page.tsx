import { PageHeader } from '@workspace/ui/components/organisms/pageHeader';
import { PageLayout } from './_components/common/pageLayout';
import { FormModal } from '@workspace/ui/components/organisms/formModal';

const Page = async () => {
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
      <FormModal modalKey={'add-user'} formComponent={<h1>test</h1>} title="アカウント管理" />
    </PageLayout>
  );
};

export default Page;
