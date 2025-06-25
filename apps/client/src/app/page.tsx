import { PageLayout } from './_components/common/pageLayout';
import { useTranslations } from 'next-intl';
import { TableComponent } from './_components/common/table';

const Page = () => {
  const t = useTranslations();

  return (
    <PageLayout>
      <TableComponent />
    </PageLayout>
  );
};

export default Page;
