import { getCDNUrl } from '../../../utils/url';
import Image from 'next/image';
import React from 'react';

type IconBoxProps = {
  type: 'edit' | 'delete';
  onclick?: () => void;
};

export const IconBox: React.FC<IconBoxProps> = ({ type = 'delete', onclick }) => {
  const iconSrc = {
    edit: '/icons/edit-icon.svg',
    delete: '/icons/Delete.svg',
  }[type];
  return (
    <div onClick={onclick}>
      <div className="border-1 rounded-xl p-2 bg-white hover:bg-slate-200">
        <Image src={getCDNUrl(iconSrc)} alt="Trash" width={20} height={20} />
      </div>
    </div>
  );
};
