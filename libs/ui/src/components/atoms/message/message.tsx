'use client';

import { message } from 'antd';
import { MessageType } from 'antd/es/message/interface';
import { IoIosInformationCircle } from 'react-icons/io';
import { IoWarning } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import { Icon, ImageIcon } from '../icon';
import { iconMap } from '@workspace/ui/icons/iconMap';

type CustomMessageType = 'normal' | 'information' | 'warning';

interface MessageOptions {
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

const MESSAGE_STYLES = {
  normal: {
    backgroundColor: 'var(--color-base-default)',
    icon: 'InformationCircle' as keyof typeof iconMap,
  },
  information: {
    backgroundColor: 'var(--color-success-default)',
    icon: 'InformationCircle' as keyof typeof iconMap,
  },
  warning: {
    backgroundColor: 'var(--color-warning-default)',
    icon: 'Warning' as keyof typeof iconMap,
  },
};

const CustomMessage = ({
  type,
  title,
  description,
  onClose,
}: {
  type: CustomMessageType;
  title: string;
  description: string;
  onClose?: () => void;
}) => {
  const icon = MESSAGE_STYLES[type].icon;

  return (
    <div
      className="flex items-start !gap-2 !w-[640px] !max-w-[640px] p-4 rounded shadow-[0px_4px_12px_0px_#00000026]"
      style={{
        backgroundColor: MESSAGE_STYLES[type].backgroundColor,
      }}
    >
      <Icon size={24} name={icon} color="var(--color-base-10)" className=" mt-[0.5]" />

      <div className="flex-grow text-base-10">
        <div className="font-bold mb-[2px] text-left text-lg">{title}</div>
        <div className="text-sm text-left font-normal ">{description}</div>
      </div>
      <button
        onClick={onClose}
        className="text-white opacity-80 hover:opacity-100 transition-opacity"
      >
        <ImageIcon path="actions/delete.svg" size={16} />
      </button>
    </div>
  );
};

export const Message = (type: CustomMessageType, options: MessageOptions): MessageType => {
  const { title, description, duration = 3, onClose } = options;

  return message.open({
    content: (
      <CustomMessage
        type={type}
        title={title}
        description={description || ''}
        onClose={() => {
          message.destroy();
          onClose?.();
        }}
      />
    ),
    duration,
    className: 'custom-message-container',
  });
};
