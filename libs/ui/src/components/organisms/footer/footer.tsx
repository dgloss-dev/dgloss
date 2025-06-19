import Image from 'next/image';
import React from 'react';

interface FooterProps {
  username?: string;
  onLogout?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ username = '佐藤敬子', onLogout }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3  text-primary-light">
      <div className="flex items-center gap-1">
        <Image src={'/images/icons/sidebar/user.svg'} alt="user" width={16} height={16} />
        <span className="text-primary-light cursor-pointer text-[16px] font-medium text-center">{username}</span>
      </div>
      <div onClick={onLogout} className="flex items-center gap-1 text-primary-light">
        <Image src={'/images/icons/sidebar/logout.svg'} alt="logout" width={16} height={16} />
        <span className="text-primary-light cursor-pointer text-[16px] font-medium text-center">ログアウト</span>
      </div>
    </div>
  );
};
