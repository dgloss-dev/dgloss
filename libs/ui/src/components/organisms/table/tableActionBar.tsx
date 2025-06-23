import React, { Suspense } from 'react';
import { Button } from '../../atoms/button/button';
import {  ImageIcon } from '../../atoms/icon';

interface TableActionBarProps {
  selectedCount: number;
  onForceLogout: () => void;
  onDelete: () => void;
  disableForceLogout?: boolean;
  disableDelete?: boolean;
}

export const TableActionBar: React.FC<TableActionBarProps> = ({
  selectedCount,
  onForceLogout,
  onDelete,
  disableForceLogout = false,
  disableDelete = false,
}) => {
  return (
    <div className="flex items-center gap-2  w-full">
      <span className="text-base  whitespace-nowrap">選択中{selectedCount}件を</span>
      <div className="flex !gap-x-2 w-full">
        <Suspense fallback={null}>
          <Button
            variant="secondary"
            disabled={disableForceLogout || selectedCount === 0}
            icon={<ImageIcon path="header/disabled.svg" size={16} className="!max-w-none" />}
            onClick={onForceLogout}
          >
            強制ログオフ
          </Button>
        </Suspense>
        <Button
          variant="warning"
          disabled={disableDelete || selectedCount === 0}
          icon={<ImageIcon path="actions/delete.svg" size={16} className="!max-w-none" />}
          onClick={onDelete}
        >
          削除
        </Button>
      </div>
    </div>
  );
};
