import React from 'react';
import AntList, {
  ListProps as AntListProps,
  ListItemProps as AntListItemProps,
} from 'antd/es/list';

interface ListProps extends AntListProps<any> {
  bordered?: boolean;
  dataSource: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: 'default' | 'large' | 'small';
  itemLayout?: 'horizontal' | 'vertical';
}

export const List: React.FC<ListProps> = ({
  children,
  bordered = false,
  dataSource,
  renderItem,
  header,
  footer,
  size = 'default',
  itemLayout = 'horizontal',
  className,
  ...props
}) => {
  return (
    <AntList
      bordered={bordered}
      dataSource={dataSource}
      renderItem={renderItem}
      header={header}
      footer={footer}
      itemLayout={itemLayout}
      size={size}
      className={className}
      {...props}
    />
  );
};

interface ListItemProps extends AntListItemProps {
  children: React.ReactNode;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ children, className, ...props }) => {
  return (
    <AntList.Item className={className} {...props}>
      {children}
    </AntList.Item>
  );
};
