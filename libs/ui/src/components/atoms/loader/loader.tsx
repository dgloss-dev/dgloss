import React from 'react';
import AntSpin, { SpinIndicator } from 'antd/es/spin';

interface LoaderProps {
  spinning?: boolean;
  delay?: number;
  size?: 'small' | 'default' | 'large';
  className?: string;
  children?: React.ReactNode;
  tip?: React.ReactNode;
  fullscreen?: boolean;
  indicator?: SpinIndicator;
}

export const Loader: React.FC<LoaderProps> = ({
  spinning = true,
  size = 'default',
  fullscreen = false,
  indicator,
  ...props
}) => {
  return (
    <AntSpin
      indicator={indicator}
      spinning={spinning}
      size={size}
      wrapperClassName={props.className}
      fullscreen={fullscreen}
      {...props}
    >
      {props.children}
    </AntSpin>
  );
};
