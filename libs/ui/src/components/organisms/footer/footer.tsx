import Image from 'next/image';
import React from 'react';
import { ImageIcon } from '../../atoms/icon';

interface FooterProps {
  username?: string;
  onLogout?: () => void;
  t: any;
}

export const Footer: React.FC<FooterProps> = ({ username = '佐藤敬子', onLogout, t }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3  ">
      <div className="flex items-center gap-2">
        <ImageIcon path="sidebar/user.svg" />
        <span className="text-primary-light cursor-pointer text-[16px] font-medium text-center">
          {username}
        </span>
      </div>
      <div onClick={onLogout} className="flex items-center gap-1 ">
        <ImageIcon path="sidebar/logout.svg" />
        <span className="text-primary-light cursor-pointer text-[16px] font-medium text-center">
          {t('sidebar.logout')}
        </span>
      </div>
    </div>
  );
};
