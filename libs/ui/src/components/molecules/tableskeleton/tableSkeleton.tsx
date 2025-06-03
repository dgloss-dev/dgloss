import React from 'react';
import AntSkeleton from 'antd/es/skeleton';
import { Skeleton } from '../../atoms/skeleton';

export const TableSkeleton: React.FC = () => {
  return (
    <div className="p-4">
      <div className="border border-gray-200 rounded-lg">
        <div className="grid grid-cols-7 gap-4 p-4 bg-gray-100">
          <AntSkeleton.Input active className="col-span-1" />
          <AntSkeleton.Input active className="col-span-2" />
          <AntSkeleton.Input active className="col-span-1" />
          <AntSkeleton.Input active className="col-span-1" />
          <AntSkeleton.Input active className="col-span-1" />
          <AntSkeleton.Input active className="col-span-1" />
        </div>

        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 items-center p-4 border-b border-gray-200"
          >
            <Skeleton active type="avatar" shape="square" size="large" />
            <AntSkeleton.Input active className="col-span-2" />
            <AntSkeleton.Input active className="col-span-1" />
            <AntSkeleton.Input active className="col-span-1" />
            <AntSkeleton.Input active className="col-span-1" />
            <AntSkeleton.Input active className="col-span-1" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 gap-1">
        <Skeleton active size="small" shape="circle" type="avatar" />
        <Skeleton active size="small" shape="circle" type="avatar" />
        <Skeleton active size="small" shape="circle" type="avatar" />
      </div>
    </div>
  );
};
