'use client';
import React, { useState } from 'react';
import { Input } from '@workspace/ui/components/atoms/input';
import { Select } from '@workspace/ui/components/atoms/select';
import { Button } from '@workspace/ui/components/atoms/button';
import { ImageIcon } from '@workspace/ui/components/atoms/icon';
import { useAppStore } from '@client/store/app.store';
import { useTranslations } from 'next-intl';

// Filter type definitions
export type FilterType = 'text' | 'select';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: FilterOption[];
}

export interface FilterListProps {
  filters: FilterConfig[];
  values: Record<string, string | number>;
  setValues: (values: Record<string, string | number>) => void;
  searchLabel?: string;
  disabled?: boolean;
}

// Helper type guards
function isStringArray(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((v) => typeof v === 'string');
}
function isNumberArray(arr: unknown): arr is number[] {
  return Array.isArray(arr) && arr.every((v) => typeof v === 'number');
}

export const FilterList: React.FC<FilterListProps> = ({
  filters,
  values,
  setValues,
  searchLabel = '検索',
  disabled = false,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string | number>>({});
  const { setRefreshAction, refresh } = useAppStore();
  const t = useTranslations('common');

  const handleChange = (key: string, value: string | number) => {
    setSelectedFilters({ ...selectedFilters, [key]: value });
  };

  const handleSearch = () => {
    setValues(selectedFilters);
    setRefreshAction(!refresh);
  };
  return (
    <>
      <div className="w-full flex items-end gap-x-6">
        {filters.map((filter) => (
          <div key={filter.key} className="w-full min-w-[140px]">
            {filter.type === 'text' ? (
              <Input
                id={`filter-${filter.key}`}
                value={selectedFilters[filter.key] as string | number}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                placeholder={filter.placeholder}
                disabled={disabled}
                label={t(`filters.${filter.label}`)}
              />
            ) : filter.type === 'select' && filter.options ? (
              <Select
                id={`filter-${filter.key}`}
                value={
                  isStringArray(selectedFilters[filter.key])
                    ? selectedFilters[filter.key]
                    : isNumberArray(selectedFilters[filter.key])
                      ? selectedFilters[filter.key]
                      : typeof selectedFilters[filter.key] === 'string' ||
                          typeof selectedFilters[filter.key] === 'number'
                        ? selectedFilters[filter.key]
                        : ''
                }
                onChange={(val) => handleChange(filter.key, val as string | number)}
                options={filter.options}
                placeholder={filter.placeholder || '選択してください'}
                disabled={disabled}
                label={t(`filters.${filter.label}`)}
                allowClear
              />
            ) : null}
          </div>
        ))}

        <Button
          icon={<ImageIcon path="actions/search.svg" />}
          variant="primary-outline"
          label={searchLabel}
          onClick={handleSearch}
        />
      </div>
    </>
  );
};
