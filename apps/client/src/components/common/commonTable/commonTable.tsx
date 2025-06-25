'use client';
import React, { useEffect, useState, useCallback } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  ColumnsType,
  Table,
  SorterResult,
  TableActionBar,
} from '@workspace/ui/components/organisms/table';
import { IPagination } from '@workspace/types/dto/common';
import { useAppStore } from '@client/store/app.store';
import { Message } from '@workspace/ui/components/atoms/message';
import { useTranslations } from 'next-intl';

// Generic interface for table data
interface TableData<T> {
  rows: T[];
  count: number;
}

// Generic interface for filter parameters
interface FilterParams extends IPagination {
  [key: string]: any;
}

// Props interface for the CommonTable component
interface CommonTableProps<T extends object> {
  // Data and state management
  initialData?: T[];
  initialCount?: number;
  tableData: T[];
  count: number;
  setTableData: (data: T[]) => void;
  setTableCount: (count: number) => void;

  // Fetch function
  onFetch: (params: FilterParams) => Promise<TableData<T>>;

  // Table configuration
  columns: ColumnsType<T>;
  rowKey: string | ((record: T) => string);

  // Optional props
  className?: string;
  rowClassName?: string | ((record: T, index: number) => string);
  loading?: boolean;
  emptyText?: string;
  nullText?: string;
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  rowHoverable?: boolean;
  highlightLastRow?: boolean;
  showSorterTooltip?: boolean;

  // Pagination
  defaultPageSize?: number;
  pageSizeOptions?: number[];

  // Sorting
  defaultSortField?: string;
  defaultSortOrder?: 1 | -1;

  // Row selection
  rowSelectionType?: 'checkbox' | 'radio';
  onRowSelect?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;

  // Row actions
  onRow?: any;

  // Expandable rows
  expandable?: {
    childrenColumnName?: string;
    indentSize?: number;
    expandIcon?: any;
    defaultExpandAllRows?: boolean;
    defaultExpandedRowKeys?: React.Key[];
    expandedRowKeys?: React.Key[];
    onExpand?: (expanded: boolean, record: T) => void;
    onExpandedRowsChange?: (expandedKeys: readonly React.Key[]) => void;
  };

  // Scroll configuration
  scroll?: {
    scrollToFirstRowOnChange?: boolean;
    x?: true | number | string;
    y?: number | string;
  };

  // Header and footer
  header?: React.ReactNode;
  footer?: React.ReactNode;

  // Error handling
  onError?: (error: any) => void;

  // URL management
  updateUrlOnChange?: boolean;
  urlParamPrefix?: string;
}

export const CommonTable = <T extends object>({
  // Data and state management
  initialData = [],
  initialCount = 0,
  tableData,
  count,
  setTableData,
  setTableCount,

  // Fetch function
  onFetch,

  // Table configuration
  columns,
  rowKey,

  // Optional props
  className = '',
  rowClassName,
  loading: externalLoading,
  emptyText,
  nullText = ' - ',
  size = 'middle',
  bordered = true,
  showHeader = true,
  rowHoverable = true,
  highlightLastRow = false,
  showSorterTooltip = true,

  // Pagination
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],

  // Sorting
  defaultSortField = 'createdAt',
  defaultSortOrder = -1,

  // Row selection
  rowSelectionType,

  // Row actions
  onRow,

  // Expandable rows
  expandable,

  // Scroll configuration
  scroll = { x: 'max-content' },

  // Header and footer
  header,
  footer,

  // Error handling
  onError,

  // URL management
  updateUrlOnChange = true,
  urlParamPrefix = '',
}: CommonTableProps<T>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  // Store hooks

  const { isLoading: globalLoading, setIsLoadingAction } = useAppStore();

  // Local state
  const [pagination, setPagination] = useState({
    current: parseInt(searchParams.get('page') || '1', 10),
    pageSize: parseInt(searchParams.get('pageSize') || defaultPageSize.toString(), 10),
    total: initialCount,
  });

  const [sortConfig, setSortConfig] = useState<{
    field: string;
    order: 1 | -1;
  }>({
    field: searchParams.get('sortBy') || defaultSortField,
    order: parseInt(searchParams.get('order') || defaultSortOrder.toString(), 10) as 1 | -1,
  });

  const [filters, setFilters] = useState<Record<string, any>>({});

  // Computed loading state
  const isLoading = externalLoading !== undefined ? externalLoading : globalLoading;

  // Fetch data function
  const fetchData = useCallback(
    async (
      page: number,
      pageSize: number,
      sortField: string,
      sortOrder: 1 | -1,
      additionalFilters: Record<string, any> = {},
    ) => {
      try {
        setIsLoadingAction(true);

        const params: FilterParams = {
          start: (page - 1) * pageSize,
          limit: pageSize,
          sortBy: sortField,
          order: sortOrder,
          ...filters,
          ...additionalFilters,
        };

        const response: any = await onFetch(params);
        if (response) {
          setTableData(response?.data?.rows);
          setTableCount(response?.data?.count);
          setPagination((prev) => ({
            ...prev,
            total: response?.data?.count,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);

        // Show error notification
        Message('warning', {
          title: "t('errors.fetch_failed')",
          description: "t('errors.fetch_failed_description')",
        });

        // Call custom error handler if provided
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoadingAction(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    if (initialData && initialCount && !tableData) {
      setTableData(initialData);
      setTableCount(initialCount);
      setPagination((prev) => ({
        ...prev,
        total: initialCount,
      }));
    } else {
      fetchData(pagination.current, pagination.pageSize, sortConfig.field, sortConfig.order);
    }
  }, []);

  // Update URL when pagination or sorting changes
  const updateUrl = useCallback(
    (newPagination: any, newSortConfig?: any) => {
      if (!updateUrlOnChange) return;

      const params = new URLSearchParams(searchParams);

      // Update pagination params
      if (newPagination) {
        params.set(`${urlParamPrefix}page`, newPagination.current?.toString() || '1');
        params.set(
          `${urlParamPrefix}pageSize`,
          newPagination.pageSize?.toString() || defaultPageSize.toString(),
        );
      }

      // Update sorting params
      if (newSortConfig) {
        params.set(`${urlParamPrefix}sortBy`, newSortConfig.field);
        params.set(`${urlParamPrefix}order`, newSortConfig.order.toString());
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
    },
    [updateUrlOnChange, searchParams, urlParamPrefix, defaultPageSize, router],
  );

  // Handle table change (pagination, sorting, filtering)
  const handleTableChange = (
    newPagination: any,
    newFilters: any,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    const hasSorting = singleSorter && singleSorter.field && singleSorter.order;

    let newSortField = defaultSortField;
    let newSortOrder = defaultSortOrder;

    if (hasSorting) {
      const { field, order } = singleSorter;
      newSortField = field as string;
      newSortOrder = order === 'ascend' ? 1 : -1;
    }

    const newSortConfig = {
      field: newSortField,
      order: newSortOrder,
    };

    const newPaginationState = {
      current: newPagination?.current ?? 1,
      pageSize: newPagination?.pageSize ?? defaultPageSize,
      total: pagination.total,
    };

    // Update local state
    setPagination(newPaginationState);
    setSortConfig(newSortConfig);
    setFilters(newFilters);

    // Update URL
    updateUrl(newPaginationState, newSortConfig);

    // Fetch new data
    fetchData(
      newPaginationState.current,
      newPaginationState.pageSize,
      newSortConfig.field,
      newSortConfig.order,
      newFilters,
    );
  };

  // Get sort order for columns
  const getSortOrder = (field: string): 'ascend' | 'descend' | undefined => {
    if (sortConfig?.field === field) {
      return sortConfig?.order === 1 ? 'ascend' : 'descend';
    }
    return undefined;
  };

  // Enhance columns with sorting
  const enhancedColumns = columns.map((col) => {
    if ('dataIndex' in col && col.sorter) {
      return {
        ...col,
        sortOrder: getSortOrder(col.dataIndex as string),
      };
    }
    return col;
  });

  const onRowSelect = (selectedRowKeys: React.Key[], selectedRows: T[]) => {
    console.log(selectedRowKeys, selectedRows);
  };

  // Row selection configuration
  const rowSelection = rowSelectionType
    ? {
        type: rowSelectionType,
        onChange: onRowSelect,
        fixed: true,
      }
    : undefined;

  return (
    <div className="w-full">
      <TableActionBar selectedCount={0} onForceLogout={() => {}} onDelete={() => {}} />
      <Table<T>
        rowKey={rowKey}
        dataSource={tableData}
        columns={enhancedColumns}
        onChange={handleTableChange}
        rowClassName={rowClassName}
        className={`custom_table ${className}`}
        emptyText={emptyText || t('table.emptyText')}
        onRowSelect={onRowSelect}
        rowSelectionType={'checkbox'}
        loading={isLoading}
        size={size}
        bordered={bordered}
        showHeader={showHeader}
        rowHoverable={rowHoverable}
        highlightLastRow={highlightLastRow}
        showSorterTooltip={showSorterTooltip}
        nullText={nullText}
        onRow={onRow}
        rowSelection={rowSelection}
        scroll={scroll}
        header={header}
        footer={footer}
        expandable={expandable}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: false,
          showLessItems: false,
          pageSizeOptions: pageSizeOptions,
        }}
        t={t}
      />
    </div>
  );
};
