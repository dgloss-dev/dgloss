import React from 'react';
import { Logo } from '@workspace/ui/components/atoms/logo';
import { USER_ROLE } from '@workspace/types/enums/user';

interface HeaderProps {
  activeRole?: USER_ROLE;
  onRoleChange?: (role: USER_ROLE) => void;
  t: any;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole = USER_ROLE.SUPERVISOR,
  onRoleChange,
  t,
}) => {
  const handleRoleClick = (role: USER_ROLE) => {
    if (onRoleChange) {
      onRoleChange(role);
    }
  };
  const managementText =
    activeRole === USER_ROLE.SUPERVISOR ? t('sidebar.adminMenu') : t('sidebar.operatorMenu');

  return (
    <div className="flex flex-col items-center justify-center w-full  pt-4 px-4 ">
      <Logo />
      <div className="flex items-center border border-dust rounded-sm w-full h-full mt-6 mb-5">
        <div
          onClick={() => handleRoleClick(USER_ROLE.SUPERVISOR)}
          className={`  w-[104px] py-1 text-center font-sf-pro cursor-pointer text-sm font-medium transition-colors duration-200 rounded-l-[4px] border-r border-dust ${
            activeRole === USER_ROLE.SUPERVISOR
              ? 'bg-accent text-primary-light'
              : 'bg-primary-dark text-primary-light hover:bg-accent'
          }`}
        >
          {t('sidebar.admin')}
        </div>
        <div
          onClick={() => handleRoleClick(USER_ROLE.OPERATOR)}
          className={`  py-1 text-center cursor-pointer font-sf-pro w-[104px] text-sm font-medium transition-colors duration-200 rounded-r-[4px] ${
            activeRole === USER_ROLE.OPERATOR
              ? 'bg-accent text-primary-light'
              : 'bg-primary-dark text-primary-light hover:bg-accent'
          }`}
        >
          {t('sidebar.operator')}
        </div>
      </div>
      <div className="flex flex-col items-start w-full ">
        <h1 className=" text-primary-light text-[12px] font-[600]">{managementText}</h1>
        <hr className="w-full bg-white mt-[14px]" />
      </div>
    </div>
  );
};
