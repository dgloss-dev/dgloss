import React from 'react';
import { Flex } from '../../molecules/flex';
import { Button } from '../../atoms/button';
import { Text } from '../../atoms/text';

interface PageHeaderProps {
  justify?: 'space-between' | 'center' | 'flex-start' | 'flex-end';
  align?: 'center' | 'flex-start' | 'flex-end';
  className?: string;
  buttonProps?: any;
  textProps?: any;
  textLabel?: string;
  onClick?: () => void;
  buttonShow?: boolean;
}
export const PageHeader: React.FC<PageHeaderProps> = ({
  justify = 'space-between',
  align = 'center',
  buttonShow = true,
  ...props
}) => {
  return (
    <Flex justify={justify} align={align} className={props.className}>
      <Text {...props.textProps}>{props.textLabel}</Text>
      {buttonShow && <Button {...props.buttonProps} onClick={props.onClick} />}
    </Flex>
  );
};
