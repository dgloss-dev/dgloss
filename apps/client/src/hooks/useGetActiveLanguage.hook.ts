import { useLocale } from 'next-intl';

export const useGetActiveLanguage = () => {
  const activeLocale = useLocale();
  return { activeLocale };
};
