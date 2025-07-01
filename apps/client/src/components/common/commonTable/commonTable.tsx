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
import { useTranslations } from 'next-intl';
import { MODAL_KEY } from '@client/constants/modalKey.constant';
import { useMessage } from '@workspace/ui/components/atoms/message';

interface TableData<T> {
  rows: T[];
  count: number;
}

interface FilterParams extends IPagination {
  [key: string]: any;
}

interface CommonTableProps<T extends object> {
  initialData?: T[];
  initialCount?: number;
  tableData: T[];
  count: number;
  setTableData: (data: T[]) => void;
  setTableCount: (count: number) => void;

  onFetch: (params: FilterParams) => Promise<TableData<T>>;

  columns: ColumnsType<T>;
  rowKey: string | ((record: T) => string);

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
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  defaultSortField?: string;
  defaultSortOrder?: 1 | -1;
  rowSelectionType?: 'checkbox' | 'radio';
  onRowSelect?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  selectedRows?: T[];
  setSelectedRows?: (selectedRows: T[]) => void;
  onRow?: any;
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
  scroll?: {
    scrollToFirstRowOnChange?: boolean;
    x?: true | number | string;
    y?: number | string;
  };
  header?: React.ReactNode;
  footer?: React.ReactNode;
  onError?: (error: any) => void;
  updateUrlOnChange?: boolean;
  urlParamPrefix?: string;
  filterComponent?: React.ReactNode;
  filters?: Record<string, any>;
  setFilters?: (filters: Record<string, any>) => void;
  actionBar?: boolean;
}

export const CommonTable = <T extends object>({
  initialData = [],
  initialCount = 0,
  tableData,
  count,
  setTableData,
  setTableCount,
  onFetch,
  columns,
  rowKey,
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
  defaultPageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  defaultSortField = 'createdAt',
  defaultSortOrder = -1,
  rowSelectionType,
  onRow,
  expandable,
  scroll = { x: 'max-content' },
  header,
  footer,
  onError,
  updateUrlOnChange = true,
  urlParamPrefix = '',
  selectedRows,
  setSelectedRows,
  filterComponent,
  filters,
  setFilters,
  actionBar = true,
}: CommonTableProps<T>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  const {
    isLoading: globalLoading,
    setIsLoadingAction,
    setOpenModalAction,
    refresh,
  } = useAppStore();

  const [pagination, setPagination] = useState({
    current: parseInt(searchParams.get('page') || '1', 10),
    pageSize: parseInt(searchParams.get('pageSize') || defaultPageSize.toString(), 10),
    total: initialCount,
  });
  const message = useMessage();

  const [sortConfig, setSortConfig] = useState<{
    field: string;
    order: 1 | -1;
  }>({
    field: searchParams.get('sortBy') || defaultSortField,
    order: parseInt(searchParams.get('order') || defaultSortOrder.toString(), 10) as 1 | -1,
  });

  const isLoading = externalLoading !== undefined ? externalLoading : globalLoading;

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
        message.error(t('descriptions.fetch_failed'));
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
  }, [refresh]);

  const updateUrl = useCallback(
    (newPagination: any, newSortConfig?: any) => {
      if (!updateUrlOnChange) return;

      const params = new URLSearchParams(searchParams);

      if (newPagination) {
        params.set(`${urlParamPrefix}page`, newPagination.current?.toString() || '1');
        params.set(
          `${urlParamPrefix}pageSize`,
          newPagination.pageSize?.toString() || defaultPageSize.toString(),
        );
      }

      if (newSortConfig) {
        params.set(`${urlParamPrefix}sortBy`, newSortConfig.field);
        params.set(`${urlParamPrefix}order`, newSortConfig.order.toString());
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.replace(newUrl);
    },
    [updateUrlOnChange, searchParams, urlParamPrefix, defaultPageSize, router],
  );

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
    setFilters?.(newFilters);

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
    setSelectedRows?.(selectedRows);
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
      <div className="flex flex-col xl:flex-row items-center justify-between pb-4 ">
        <div className={`flex items-center gap-2 pt-[26px]  w-full ${className}`}>
          {actionBar && (
            <TableActionBar
              selectedCount={selectedRows?.length || 0}
              onForceLogout={() => setOpenModalAction(MODAL_KEY.PROHIBITED_MODAL, true)}
              onDelete={() => {
                setOpenModalAction(MODAL_KEY.DELETE_MODAL, true);
              }}
              className="order-2 xl:order-1"
            />
          )}
        </div>
        <div className="order-1 xl:order-2 w-full">{filterComponent && filterComponent}</div>
      </div>
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
