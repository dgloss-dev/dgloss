import React from 'react';
import { Logo } from '../../atoms/logo';

interface HeaderProps {
  activeRole?: 'admin' | 'operator';
  onRoleChange?: (role: 'admin' | 'operator') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeRole = 'admin', 
  onRoleChange 
}) => {
    
  const handleRoleClick = (role: 'admin' | 'operator') => {
    if (onRoleChange) {
      onRoleChange(role);
    }
  };
  const managementText = activeRole === 'admin' ? '管理メニュー' : 'オペレーターメニュー';

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4 pt-4 px-4 mb-2">
      <Logo />  
      <div className="flex items-center border border-dust rounded-sm w-full h-full mt-2 mb-[14px]">
        <div
          onClick={() => handleRoleClick('admin')}
          className={`   py-1 text-center cursor-pointer w-full text-sm font-medium transition-colors duration-200 rounded-l-[4px] border-r border-dust ${
            activeRole === 'admin'
              ? 'bg-accent text-primary-light'
              : 'bg-primary-dark text-primary-light hover:bg-accent'
          }`}
        >
          管理者
        </div>
        <div
          onClick={() => handleRoleClick('operator')}
          className={`  py-1 text-center cursor-pointer  w-full text-sm font-medium transition-colors duration-200 rounded-r-[4px] ${
            activeRole === 'operator'
              ? 'bg-accent text-primary-light'
              : 'bg-primary-dark text-primary-light hover:bg-accent'
          }`}
        >
          オペレーター
        </div>
      </div>
      <div className="flex flex-col items-start w-full">
        <h1 className=' text-primary-light text-[12px] font-[600]'>{managementText}</h1>
        <hr className='w-full bg-white mt-[14px]' />
      </div>
    </div>
  );
};
