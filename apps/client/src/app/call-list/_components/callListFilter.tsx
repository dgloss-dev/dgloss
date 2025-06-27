import React, { useState } from 'react';
import { FilterList, FilterConfig } from '../../../components/common/filters/filterList';
import { useAppStore } from '@client/store/app.store';

export const CallListFilter = () => {
  const { filterValues, setFilterValues } = useAppStore();
  

  const filterConfigs: FilterConfig[] = [
    {
      key: 'listId',
      label: 'listId',
      type: 'text',
      placeholder: '',
    },
    {
      key: 'listName',
      label: 'listName',
      type: 'text',
      placeholder: '',
    },
    {
      key: 'aiCall',
      label: 'aiCall',
      type: 'select',
      options: [
        { label: '可', value: '2' },
        { label: '不可', value: '3' },
      ],
      placeholder: '選択してください',
    },
    {
      key: 'status',
      label: 'status',
      type: 'select',
      options: [
        { label: '有効', value: '1' },
        { label: '無効', value: '2' },
      ],
      placeholder: '選択してください',
    },
  ];

  return (
    <FilterList
      filters={filterConfigs}
      values={filterValues}
      setValues={setFilterValues}
      searchLabel="検索"
    />
  );
};
