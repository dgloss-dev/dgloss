'use client';
import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ColumnsType } from '@workspace/ui/components/organisms/table';
import { CommonTable } from '@client/components/common/commonTable/commonTable';
import { ICallList } from '@workspace/types/interfaces/callList';
import { FilterCallListDto } from '@workspace/types/dto/callList';
import { getAllCallListsClient } from '@client/services/callList.client.services';
import { CALL_STATUS } from '@workspace/types/enums/callList';
import { Button } from '@workspace/ui/components/atoms/button';
import { ImageIcon } from '@workspace/ui/components/atoms/icon';
import { Tag } from '@workspace/ui/components/atoms/tag';

interface CallListTableProps {
  className?: string;
  initialData?: ICallList[];
  initialCount?: number;
}

export const CallListTable: React.FC<CallListTableProps> = ({
  className,
  initialData,
  initialCount,
}) => {
  const t = useTranslations('common');

  // State for table data
  const [tableData, setTableData] = useState<ICallList[]>([]);
  const [count, setCount] = useState(0);
  const callListTexts = useTranslations('callList');

  // Fetch function for the CommonTable

  // Get status badge type
  const getStatusType = (status: CALL_STATUS) => {
    switch (status) {
      case CALL_STATUS.ON_CALL:
        return 'active';
      case CALL_STATUS.CALL_SUSPENDED:
        return 'pause';
      case CALL_STATUS.MANUAL_STOP:
        return 'inActive';
      case CALL_STATUS.COMPLETED:
        return 'inActive';
      default:
        return 'inActive';
    }
  };

  // Get status display text
  const getStatusText = (status: CALL_STATUS) => {
    switch (status) {
      case CALL_STATUS.ON_CALL:
        return callListTexts('table.aiCalling');
      case CALL_STATUS.CALL_SUSPENDED:
        return callListTexts('table.aiStopped');
      case CALL_STATUS.MANUAL_STOP:
        return callListTexts('table.aiStopped');
      case CALL_STATUS.COMPLETED:
        return callListTexts('table.aiStopped');
      default:
        return status;
    }
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return date?.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Table columns configuration
  const columns: ColumnsType<ICallList> = [
    {
      title: callListTexts('table.listId'),
      dataIndex: 'id',
      key: 'id',
      width: 128,
      sorter: true,
      render: (id: number) => <span className="text-gray-900">{id}</span>,
    },
    {
      title: callListTexts('table.callListName'),
      dataIndex: 'name',
      key: 'name',
      width: 453,
      sorter: true,
      render: (text: string) => <span className="font-medium text-gray-900">{text}</span>,
    },
    {
      title: callListTexts('table.targetCount'),
      dataIndex: 'callersCount',
      key: 'callersCount',
      width: 146,
      sorter: true,
      render: (callersCount: number) => (
        <span className="text-gray-600">{Number(callersCount)}</span>
      ),
    },
    {
      title: callListTexts('table.aiOperationCount'),
      dataIndex: 'noAi',
      key: 'noAi',
      width: 120,
      sorter: true,
      render: (noAi: number) => <span className="text-gray-600">{noAi}</span>,
    },
    {
      title: callListTexts('table.aiCallAvailability'),
      dataIndex: 'isCallPossible',
      key: 'isCallPossible',
      width: 120,
      sorter: true,
      render: (isCallPossible: boolean) => (
        <Tag type={isCallPossible ? 'active' : 'inActive'}>
          {isCallPossible
            ? callListTexts('table.aiCallPossible')
            : callListTexts('table.aiCallNotPossible')}
        </Tag>
      ),
    },
    {
      title: callListTexts('table.status'),
      dataIndex: 'callStatus',
      key: 'callStatus',
      width: 150,
      sorter: true,
      render: (status: CALL_STATUS) => (
        <Tag type={getStatusType(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: callListTexts('table.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      sorter: true,
      render: (date: string) => (
        <span className="text-gray-600">{date ? formatDate(new Date(date)) : ' - '}</span>
      ),
    },
    {
      title: '',
      key: 'actions',

      fixed: 'right',
      render: (_, record: ICallList) => (
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="primary-outline"
            size="small"
            icon={<ImageIcon path="actions/edit.svg" size={16} />}
            onClick={() => handleEdit(record)}
            label={callListTexts('table.edit')}
          />
          <Button
            variant="primary-outline"
            size="small"
            icon={<ImageIcon path="actions/target.svg" size={16} />}
            onClick={() => handleTarget(record)}
            label={callListTexts('table.target')}
          />
        </div>
      ),
    },
  ];

  // Action handlers
  const handleEdit = (record: ICallList) => {
    // TODO: Implement edit functionality
    console.log('Edit call list:', record);
  };

  const handleTarget = (record: ICallList) => {
    // TODO: Implement target functionality
    console.log('Target call list:', record);
  };

  return (
    <div className={className}>
      <CommonTable<ICallList>
        tableData={tableData}
        count={count}
        setTableData={setTableData}
        setTableCount={setCount}
        onFetch={getAllCallListsClient}
        columns={columns}
        rowKey="id"
        className="call-list-table"
        initialCount={initialCount}
        initialData={initialData}
        defaultPageSize={10}
        pageSizeOptions={[10, 20, 50, 100]}
        onRow={(record: ICallList) => ({
          onClick: () => handleEdit(record),
          className: 'cursor-pointer',
        })}
        scroll={{ x: 1200 }}
        updateUrlOnChange={true}
        urlParamPrefix="callList_"
      />
    </div>
  );
};
