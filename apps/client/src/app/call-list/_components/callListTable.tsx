'use client';
import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ColumnsType } from '@workspace/ui/components/organisms/table';
import { CommonTable } from '@client/components/common/commonTable/commonTable';
import { ICallList } from '@workspace/types/interfaces/callList';
import {
  bulkDeleteCallListsClient,
  getAllCallListsClient,
} from '@client/services/callList.client.services';
import { CALL_STATUS } from '@workspace/types/enums/callList';
import { Button } from '@workspace/ui/components/atoms/button';
import { ImageIcon } from '@workspace/ui/components/atoms/icon';
import { Tag } from '@workspace/ui/components/atoms/tag';
import { formatDateWithTime } from '@client/utils/date.utils';
import { getCallStatusType } from '@client/utils/getStatus.utils';
import { getCallStatusLabel } from '@client/utils/getStatus.utils';
import { useAppStore } from '@client/store/app.store';
import { CallListForm } from './callListForm';
import { CallListFilter } from './callListFilter';
import { MODAL_KEY } from '@client/constants/modalKey.constant';
import { FormModal } from '@client/components/common/form/formModal';
import { useCallListStore } from '@client/store/callListStore';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@client/constants/routes.constant';
import { useWindowSize } from '@workspace/ui/hooks/useWindowSize';
import { ItemSelectionModal } from '@client/components/common/modal/itemSelectionModal';

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
  const router = useRouter();
  const callListTexts = useTranslations('callList');
  const { setOpenModalAction } = useAppStore();
  const { width } = useWindowSize();
  const {
    selectedRows,
    setSelectedRows,
    setCallListData,
    setCallListCount,
    callListData,
    callListCount,
  } = useCallListStore();
  const { filterValues, setFilterValues } = useAppStore();
  const [record, setRecord] = useState<ICallList | undefined>(undefined);
  const columns: ColumnsType<ICallList> = [
    {
      title: callListTexts('table.listId'),
      dataIndex: 'id',
      key: 'id',
      width: 128,
      sorter: true,
    },
    {
      title: callListTexts('table.callListName'),
      dataIndex: 'name',
      key: 'name',
      width: 453,
      sorter: true,
    },
    {
      title: callListTexts('table.targetCount'),
      dataIndex: 'callersCount',
      key: 'callersCount',
      width: 146,
      sorter: true,
    },
    {
      title: callListTexts('table.aiOperationCount'),
      dataIndex: 'noAi',
      key: 'noAi',
      width: 120,
      sorter: true,
    },
    {
      title: callListTexts('table.aiCallAvailability'),
      dataIndex: 'isCallPossible',
      key: 'isCallPossible',
      width: 180,
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
        <Tag
          icon={
            <ImageIcon
              path={
                status === CALL_STATUS.ON_CALL
                  ? 'status/callActive.svg'
                  : status === CALL_STATUS.CALL_SUSPENDED
                    ? 'status/callPaused.svg'
                    : 'status/callInactive.svg'
              }
              size={12}
            />
          }
          type={getCallStatusType(status)}
        >
          {getCallStatusLabel(status, callListTexts)}
        </Tag>
      ),
    },
    {
      title: callListTexts('table.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 200,
      sorter: true,
      render: (date: string) => (
        <span className="text-base">{date ? formatDateWithTime(new Date(date)) : ' - '}</span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 245,
      fixed: width && width > 1024 ? 'right' : undefined,
      render: (_, record: ICallList) => (
        <div className="flex items-center justify-center gap-2 !w-full">
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

  const handleEdit = (record: ICallList) => {
    setRecord(record);
    setOpenModalAction(MODAL_KEY.CALL_LIST, true);
  };

  const handleTarget = (record: any) => {
    router.push(`${ROUTES.CALL_LIST}/${record?.id}`);
  };

  const selectedModalColumns = [
    {
      title: callListTexts('table.listId'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: callListTexts('table.callListName'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <div className={className}>
      <CommonTable<ICallList>
        tableData={callListData}
        count={callListCount}
        setTableData={setCallListData}
        setTableCount={setCallListCount}
        onFetch={getAllCallListsClient}
        columns={columns}
        rowKey="id"
        className="call-list-table"
        initialCount={initialCount}
        initialData={initialData}
        defaultPageSize={10}
        pageSizeOptions={[10, 20, 50, 100]}
        scroll={{ x: 1200 }}
        updateUrlOnChange={true}
        urlParamPrefix="callList_"
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        filterComponent={<CallListFilter />}
        filters={filterValues}
        setFilters={setFilterValues}
      />
      <ItemSelectionModal
        onClose={() => setOpenModalAction(MODAL_KEY.DELETE_MODAL, false)}
        apiFunc={bulkDeleteCallListsClient}
        selectedIds={selectedRows?.map((row: any) => Number(row?.id))}
        titleKey="delete_call_list"
        columns={selectedModalColumns}
        data={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <ItemSelectionModal
        onClose={() => setOpenModalAction(MODAL_KEY.PROHIBITED_MODAL, false)}
        apiFunc={bulkDeleteCallListsClient}
        selectedIds={selectedRows?.map((row: any) => Number(row?.id))}
        titleKey="prohibited_call_list"
        columns={selectedModalColumns}
        data={selectedRows}
        setSelectedRows={setSelectedRows}
        type="prohibited"
      />
      <FormModal
        modalKey={MODAL_KEY.CALL_LIST}
        formComponent={<CallListForm record={record} />}
        titleKey={'call_list_register'}
        onCancel={() => {
          setRecord(undefined);
        }}
      />
    </div>
  );
};
