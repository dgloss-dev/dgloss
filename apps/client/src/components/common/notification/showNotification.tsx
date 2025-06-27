import { Message, CustomMessageType } from '@workspace/ui/components/atoms/message';
import { useTranslations } from 'next-intl';

// not finished yet

export const ShowNotification = ({
  type = 'information',
  titleKey,
  descriptionKey,
}: {
  type?: CustomMessageType;
  titleKey?: string;
  descriptionKey?: string;
}) => {
  const t = useTranslations('common');
  const title = t(`messages.${titleKey} `);
  const description = t(`errors.${descriptionKey}`);
  Message(type, {
    title,
    description,
  });
};
