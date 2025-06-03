import React from 'react';
import AntdProgress, { ProgressProps } from 'antd/es/progress';

export const Progress: React.FC<ProgressProps> = (props) => {
  return <AntdProgress {...props} />;
};
