'use client';
import React from 'react';
import { ConfigProvider, Pagination, Select } from 'antd';
import AntTable from 'antd/es/table';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { SortOrder, SorterResult, TableRowSelection } from 'antd/es/table/interface';
import { CustomPagination } from '../../molecules/customPagination';

type Prop<T extends object> = {
  columns: ColumnsType<T>;
  dataSource: T[];
  pagination?: false | TableProps['pagination'];
  rowKey: string | ((record: T) => string);
  rowSelectionType?: 'checkbox' | 'radio';
  onRowSelect?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  rowHoverable?: boolean;
  showHeader?: boolean;
  className?: string;
  rowClassName?: string | ((record: T, index: number) => string);
  scroll?: {
    scrollToFirstRowOnChange?: boolean;
    x?: true | number | string;
    y?: number | string;
  };
  nullText?: string;
  onRow?: any;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  emptyText?: string;
  highlightLastRow?: boolean;
  rowSelection?: TableRowSelection;
  showSorterTooltip?: boolean;
  expandable?: TableProps<T>['expandable'];
  childrenColumnName?: string;
  indentSize?: number;
  expandIcon?: TableProps<T>['expandIcon'];
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: React.Key[];
  expandedRowKeys?: React.Key[];
  onExpand?: (expanded: boolean, record: T) => void;
  onExpandedRowsChange?: (expandedKeys: readonly React.Key[]) => void;
};

// Type guard for pagination
function isPaginationObject(
  pagination: unknown,
): pagination is Exclude<TableProps['pagination'], false | undefined> {
  return typeof pagination === 'object' && pagination !== null;
}

export const Table = <T extends object>(props: Prop<T>) => {
  const {
    scroll = { x: 'max-content' },
    nullText = ' - ',
    highlightLastRow,
    childrenColumnName,
    indentSize,
    expandIcon,
    defaultExpandAllRows,
    defaultExpandedRowKeys,
    expandedRowKeys,
    onExpand,
    onExpandedRowsChange,
    ...otherProps
  } = props;

  const [current, setCurrent] = React.useState(
    (otherProps.pagination && otherProps.pagination.current) || 1,
  );
  const [pageSize, setPageSize] = React.useState(
    (otherProps.pagination && otherProps.pagination.pageSize) || 10,
  );
  const total =
    isPaginationObject(otherProps.pagination) && otherProps.pagination.total !== undefined
      ? otherProps.pagination.total
      : otherProps.dataSource.length;

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
    if (isPaginationObject(otherProps.pagination) && otherProps.pagination.onChange) {
      otherProps.pagination.onChange(page, size);
    }
    otherProps.onChange?.(
      {
        ...(isPaginationObject(otherProps.pagination) ? otherProps.pagination : {}),
        current: page,
        pageSize: size,
      },
      undefined,
      undefined,
    );
  };

  const enhancedColumns = otherProps.columns.map((col) => {
    const baseColumn = {
      ...col,
      width: col.width,
      fixed: col.fixed,
      ellipsis: true,
      align: col.align || 'left',
      sortDirections: ['ascend', 'descend'] as SortOrder[],
      defaultSortOrder: col.defaultSortOrder,
    };

    if (!col.render) {
      return {
        ...baseColumn,
        render: (text: any) =>
          text === null || text === undefined || text === '' ? (
            <span className="text-gray-400">{nullText}</span>
          ) : (
            text
          ),
      };
    }

    return baseColumn;
  });

  const loadingConfig = props.loading
    ? {
        indicator: <div className="loader " />,
        spinning: true,
      }
    : false;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'var(--color-base-80)',
          fontSize: 16,
        },
        components: {
          Table: {
            headerBg: 'var(--color-secondary)',
            headerColor: 'var(--color-base)',
            fontWeightStrong: 400,
            fontSize: 16,
            rowHoverBg: 'var(--color-base-20)',
            borderColor: 'var(--color-dust)',
            rowSelectedBg: 'var(--color-primary-10)',
            rowSelectedHoverBg: 'var(--color-base-30)',
            cellPaddingInline: 16,
            cellPaddingBlock: 12,
            cellPaddingInlineMD: 16,
            cellPaddingBlockMD: 12,
            cellFontSize: 16,
            cellFontSizeMD: 16,
            cellFontSizeSM: 16,
            colorText: 'var(--color-base-dark)',
            headerSplitColor: '#f0f0f0',
            paddingContentVerticalLG: 16,
            bodySortBg: 'undefined',
            headerSortActiveBg: 'var(--color-dust)',
          },
        },
      }}
    >
      <div className="w-full flex flex-col space-y-4">
        <AntTable<T>
          columns={enhancedColumns}
          className={`w-full ${otherProps.className || ''}`}
          dataSource={otherProps.dataSource}
          scroll={scroll}
          rowKey={otherProps.rowKey}
          size={otherProps.size || 'middle'}
          pagination={false}
          bordered={true}
          loading={loadingConfig}
          rowHoverable={otherProps.rowHoverable}
          onRow={props.onRow}
          showHeader={otherProps.showHeader}
          showSorterTooltip={props.showSorterTooltip}
          onChange={otherProps.onChange}
          rowSelection={props.rowSelection}
          expandable={{
            expandIcon: expandIcon,
            childrenColumnName: childrenColumnName,
            indentSize: indentSize,
            defaultExpandAllRows: defaultExpandAllRows,
            defaultExpandedRowKeys: defaultExpandedRowKeys,
            expandedRowKeys: expandedRowKeys,
            onExpand: onExpand,
            onExpandedRowsChange: onExpandedRowsChange,
          }}
          sticky
          locale={{
            emptyText: props.emptyText ?? 'コンテンツはありません',
            triggerAsc: 'クリックして昇順に並び替え',
            triggerDesc: 'クリックして降順に並び替え',
            cancelSort: '並び替えをキャンセル',
          }}
          rowClassName={(record, index) => {
            const baseClass = 'hover:bg-gray-50';
            const lastRowClass =
              highlightLastRow && index === otherProps.dataSource.length - 1 ? 'highlight-row' : '';
            return `${baseClass} ${lastRowClass} ${
              typeof otherProps.rowClassName === 'function'
                ? otherProps.rowClassName(record, index)
                : otherProps.rowClassName || ''
            }`;
          }}
          {...(otherProps.rowSelectionType && {
            rowSelection: {
              type: otherProps.rowSelectionType,
              onChange: otherProps.onRowSelect,
              fixed: true,
            },
          })}
          {...(otherProps.footer && {
            footer: () => otherProps.footer,
          })}
          {...(otherProps.header && {
            title: () => otherProps.header,
          })}
        />
        {otherProps.pagination !== false && (
          <CustomPagination
            current={current}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export { ColumnsType, SorterResult, TableRowSelection, TableProps };
