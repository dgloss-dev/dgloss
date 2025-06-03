'use client';
import React, { useState } from 'react';
import { ConfigProvider, TableProps } from 'antd';
import AntTable from 'antd/es/table';
import type { ColumnsType } from 'antd/es/table';
import type { SortOrder } from 'antd/es/table/interface';
import { Icon } from '../../atoms/icon';

type Prop<T extends object> = {
  columns: ColumnsType<T>;
  dataSource: T[];
  pagination?: false | TableProps['pagination'];
  rowKey: string;
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
};

export const Table = <T extends object>(props: Prop<T>) => {
  const {
    scroll = { x: 'max-content' },
    nullText = ' - ',
    highlightLastRow,
    ...otherProps
  } = props;
  const [currentColumn, setCurrentColumn] = useState<string | undefined>('');

  const enhancedColumns = otherProps.columns.map((col) => {
    const renderHeaderWithSortIcon = (
      text: string,
      sorter: any,
      sortOrder: SortOrder | undefined,
    ) => {
      const isActive = sortOrder !== null && sortOrder !== undefined && currentColumn == col.title;
      const iconClass = isActive ? 'text-blue-500 rotate-icon' : 'theme-text--sub';

      return (
        <div
          className="flex items-center gap-2"
          onClick={() => {
            setCurrentColumn(col.title as string);
          }}
        >
          <span>{text}</span>
          {sorter && (
            <span className={`sort-icon ${isActive ? 'sort-icon-active' : ''}`}>
              <Icon
                name="DownArrow"
                className={`${iconClass} ${
                  sortOrder === 'ascend' && currentColumn == col.title ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </span>
          )}
        </div>
      );
    };

    const baseColumn = {
      ...col,
      width: col.width,
      fixed: col.fixed,
      ellipsis: true,
      align: col.align || 'left',
    };

    if (col.sorter) {
      return {
        ...baseColumn,
        title: (props: { sortOrder?: SortOrder }) =>
          renderHeaderWithSortIcon(
            col.title as string,
            col.sorter,
            props.sortOrder,
          ) as React.ReactNode,
        sortDirections: ['ascend', 'descend'] as SortOrder[],
        defaultSortOrder: col.defaultSortOrder,
      };
    }

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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          fontSize: 14,
          borderRadius: 6,
        },
        components: {
          Table: {
            headerBg: '#fafafa',
            headerColor: 'rgba(0, 0, 0, 0.88)',
            rowHoverBg: '#fafafa',
            borderColor: '#f0f0f0',
            cellPaddingInline: 16,
            cellPaddingBlock: 16,
            cellFontSize: 14,
            headerBorderRadius: 0,
            headerSplitColor: '#f0f0f0',
            paddingContentVerticalLG: 16,
          },
        },
      }}
    >
      <AntTable<T>
        columns={enhancedColumns}
        className={otherProps.className}
        dataSource={otherProps.dataSource}
        scroll={scroll}
        rowKey={otherProps.rowKey}
        size={otherProps.size || 'middle'}
        pagination={{
          position: ['bottomRight'],
          ...otherProps.pagination,
        }}
        bordered={otherProps.bordered}
        loading={otherProps.loading}
        rowHoverable={otherProps.rowHoverable}
        onRow={props.onRow}
        showHeader={otherProps.showHeader}
        onChange={otherProps.onChange}
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
    </ConfigProvider>
  );
};
