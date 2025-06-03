import React from 'react';
import AntDivider from 'antd/es/divider';

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => {
  return <AntDivider className={className} />;
};
