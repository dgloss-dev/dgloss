'use client';
import React from 'react';
import { Button } from '../../atoms/button/button';
import { ImageIcon } from '../../atoms/icon';
import { useTranslations } from 'next-intl';

interface TableActionBarProps {
  selectedCount: number;
  onForceLogout: () => void;
  onDelete: () => void;
  disableForceLogout?: boolean;
  disableDelete?: boolean;
  activeActions?: {
    forceLogout: boolean;
    delete: boolean;
  };
}

export const TableActionBar: React.FC<TableActionBarProps> = ({
  selectedCount,
  onForceLogout,
  onDelete,
  disableForceLogout = false,
  disableDelete = false,
  activeActions = {
    forceLogout: true,
    delete: true,
  },
}) => {
  const t = useTranslations('common');
  return (
    <div className="flex items-center gap-2  w-full">
      <span className="text-base  whitespace-nowrap">
        {t('table.selected')} {selectedCount} {t('table.items')}
      </span>
      <div className="flex !gap-x-2 w-full">
        {activeActions.forceLogout && (
          <Button
            variant="secondary"
            disabled={disableForceLogout || selectedCount === 0}
            icon={<ImageIcon path="header/disabled.svg" size={16} className="!max-w-none" />}
            onClick={onForceLogout}
          >
            {t('buttons.forceLogout')}
          </Button>
        )}

        {activeActions.delete && (
          <Button
            variant="warning"
            disabled={disableDelete || selectedCount === 0}
            icon={<ImageIcon path="actions/delete.svg" size={16} className="!max-w-none" />}
            onClick={onDelete}
          >
            {t('buttons.delete')}
          </Button>
        )}
      </div>
    </div>
  );
};
