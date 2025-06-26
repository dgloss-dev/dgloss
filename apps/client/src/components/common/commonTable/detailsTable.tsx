'use client';
import React from 'react';
import { Tag } from 'libs/ui/src/components/atoms/tag/tag';
import { TextArea } from 'libs/ui/src/components/atoms/textArea/textArea';
import Link from 'next/link';

interface DetailsTableValue {
  title: string;
  value: React.ReactNode | React.ReactNode[];
  valueType?: 'text' | 'tag' | 'link' | 'textarea';
  linkHref?: string; // for link type
  tagType?: 'active' | 'pause' | 'inActive' | 'custom';
}

interface DetailsTableProps {
  title?: string;
  values: DetailsTableValue[];
  type?: 'large' | 'small';
}

export const DetailsTable: React.FC<DetailsTableProps> = ({ title, values, type = 'large' }) => {
  const gridCols = type === 'large' ? 'grid-cols-3' : 'grid-cols-2';
  const titleClass =
    type === 'large'
      ? 'text-base font-sf-pro font-[600] w-full border bg-secondary border-dust py-[13px] px-4 text-sm'
      : 'text-sm font-sf-pro font-[600] w-full border bg-secondary border-dust py-[13px] px-4';
  const valueClass =
    type === 'large'
      ? 'font-normal font-sf-pro w-full border border-dust py-[13px] px-4 bg-primary text-base w-full text-nowrap'
      : 'font-normal font-sf-pro w-full border border-dust py-[13px] px-4 bg-primary text-sm w-full text-nowrap';

  const renderValue = (item: DetailsTableValue) => {
    switch (item.valueType) {
      case 'tag':
        return <Tag type={item.tagType}>{item.value}</Tag>;
      case 'link':
        return item.linkHref ? (
          <Link href={item.linkHref} legacyBehavior>
            <a
              className="text-blue-600 underline truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.value}
            </a>
          </Link>
        ) : (
          item.value
        );
      case 'textarea':
        return <TextArea value={String(item.value)} disabled rows={type === 'large' ? 3 : 2} />;
      default:
        return item.value;
    }
  };

  return (
    <div className={`grid ${gridCols} gap-x-4`}>
      {values.map((item, idx) => {
        if (Array.isArray(item.value)) {
          return (
            <div key={idx} className="flex w-full ">
              <div
                className={
                  'w-full text-base font-sf-pro font-[600] text-center pl-4  border bg-secondary border-dust py-[13px]  text-sm !text-wrap flex items-center  '
                }
              >
                {item.title}
              </div>
              <div className={'flex flex-col w-full'}>
                {item.value.map((val, vIdx) => (
                  <div key={vIdx} className={valueClass}>
                    {renderValue({ ...item, value: val })}
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div key={idx} className="flex w-full ">
              <div className={titleClass}>{item.title}</div>
              <div className={valueClass}>{renderValue(item)}</div>
            </div>
          );
        }
      })}
    </div>
  );
};
