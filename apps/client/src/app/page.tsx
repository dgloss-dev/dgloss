import { PageHeader } from '@workspace/ui/components/organisms/pageHeader';
import { PageLayout } from './_components/common/pageLayout';
import { ROUTES } from '@client/constants';
import { TableActionBar } from '@workspace/ui/components/organisms/table';

const Page = async () => {
  return (
    <PageLayout>
      <PageHeader
        titleKey="accountList"
        buttonLabelKey="add"
        addRoute={ROUTES.ADD_USER}
        breadcrumbItems={[
          { title: '管理者', href: '/' },
          { title: 'アカウント管理', href: '/page' },
        ]}
      />
    </PageLayout>
  );
};

export default Page;
