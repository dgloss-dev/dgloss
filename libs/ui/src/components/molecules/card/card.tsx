import React, { Suspense } from 'react';
import { Skeleton } from 'antd';
import AntCard from 'antd/lib/card';

const { Meta } = AntCard;

type Prop = {
  title?: React.ReactNode;
  bordered?: boolean;
  extra?: React.ReactNode;
  cover?: React.ReactNode;
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  styles?: {
    title?: string;
    header?: string;
    body?: string;
  };
};

export const Card: React.FC<Prop> & { Meta: typeof Meta } = ({
  title,
  extra,
  cover,
  children,
  hoverable,
  className,
  styles,
  bordered = false,
}) => {
  return (
    <AntCard
      title={title}
      extra={extra}
      cover={cover}
      hoverable={hoverable}
      bordered={bordered}
      className={`h-full w-full ${className ? className : '!px-4 sm:!px-8 '}`}
      classNames={{
        title: `text-primary sm:text-lg ${styles?.title}`,
        header: `!border-b-primary !border-b-2 !px-0 !min-h-0 !pt-6 !pb-2 ${styles?.header}`,
        body: `!px-0 ${styles?.body}`,
      }}
    >
      {children}
    </AntCard>
  );
};

Card.Meta = Meta;

const CardWithSuspense = (props: Prop) => {
  return (
    <Suspense fallback={<Skeleton active />}>
      <Card {...props} />
    </Suspense>
  );
};

export default CardWithSuspense;
