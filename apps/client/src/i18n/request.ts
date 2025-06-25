import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { COOKIE_STORAGE_KEYS } from '../constants/cookieKeys.constants';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_STORAGE_KEYS.NEXT_LOCALE)?.value || 'jp';
  const messages = {
    common: (await import(`../../public/translations/common/${locale}.json`)).default,
};

  return {
    locale,
    messages,
  };
});
