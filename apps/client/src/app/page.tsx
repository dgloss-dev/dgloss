import { PageLayout } from '@client/components/common/pageLayout';
import { useTranslations } from 'next-intl';

const Page = () => {
  const t = useTranslations();

  return (
    <PageLayout>
      <h1> DGLOSS</h1>
    </PageLayout>
  );
};

export default Page;
