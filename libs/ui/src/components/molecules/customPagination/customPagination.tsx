import React from 'react';
import { Pagination } from '../../molecules/pagination';
import { Select } from '../../atoms/select';

export type CustomPaginationProps = {
  current: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: (string | number)[];
  t: any;
};

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  current,
  pageSize,
  total,
  onPageChange,
  pageSizeOptions,
  t,
}) => {
  return (
    <div className="flex items-center justify-between w-full ">
      <div className="text-sm text-gray-700">
        {`${(current - 1) * pageSize + 1} - ${Math.min(current * pageSize, total)} / ${total}`}
      </div>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        showSizeChanger={false}
        onChange={(page) => onPageChange(page, pageSize)}
        showQuickJumper={false}
      />
      <div className="flex items-center gap-2">
        <label className=" text-nowrap text-sm text-[#000000]">{t('table.listCount')}</label>
        <Select
          value={pageSize}
          onChange={(value) => onPageChange(1, Number(value))}
          id="pageSize"
          options={
            pageSizeOptions
              ? pageSizeOptions.map((size) => ({
                  label: `${size} / page`,
                  value: Number(size),
                }))
              : [
                  { label: `${t('table.listCount10')}`, value: 10 },
                  { label: `${t('table.listCount20')}`, value: 20 },
                  { label: `${t('table.listCount50')}`, value: 50 },
                  { label: `${t('table.listCount100')}`, value: 100 },
                ]
          }
        />
      </div>
    </div>
  );
};
