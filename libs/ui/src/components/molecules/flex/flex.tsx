import React from 'react';
import AntFlex from 'antd/es/flex';

interface FlexProps {
  children: React.ReactNode;
  justify?:
    | 'flex-start'
    | 'start'
    | 'flex-end'
    | 'center'
    | 'space-around'
    | 'end'
    | 'space-between';
  align?: 'start' | 'center' | 'end' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch';
  vertical?: boolean;
  wrap?: boolean;
  gap?: 'small' | 'middle' | 'large' | string | number;
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  justify = 'start',
  align = 'top',
  vertical = false,
  wrap = true,
  gap,
  className,
}) => {
  return (
    <AntFlex
      justify={justify}
      align={align}
      vertical={vertical}
      wrap={wrap}
      gap={gap}
      className={className}
    >
      {children}
    </AntFlex>
  );
};
