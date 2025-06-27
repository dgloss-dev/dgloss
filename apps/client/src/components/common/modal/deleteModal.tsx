import { useAppStore } from '@client/store/app.store';
import { Modal } from '@workspace/ui/components/molecules/modal';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Table } from '@workspace/ui/components/organisms/table';
import { ColumnsType } from 'antd/es/table';
import { MODAL_KEY } from '@client/constants/modalKey.constant';
import { useMessage } from '@workspace/ui/components/atoms/message';

interface DeleteModalProps {
  onClose: () => void;
  onDelete: (any: any) => void;
  deletedIDs: any[];
  titleKey: string;
  columns: ColumnsType<any>;
  data: any[];
  setSelectedRows: (selectedRows: any[]) => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  onDelete,
  deletedIDs,
  titleKey,
  columns,
  data,
  setSelectedRows,
}) => {
  const {
    setOpenModalAction,
    openModals,
    setRefreshAction,
    refresh,
    setIsLoadingAction,
    isLoading,
  } = useAppStore();

  const handleCancel = () => {
    setOpenModalAction(MODAL_KEY.DELETE_MODAL, false);
  };
  const t = useTranslations('common');
  const title = t(`deleteModal.${titleKey}`);

  const message = useMessage();
  const handleDelete = async () => {
    try {
      setIsLoadingAction(true);
      await onDelete(deletedIDs);
      setOpenModalAction(MODAL_KEY.DELETE_MODAL, false);
      setSelectedRows([]);
      setRefreshAction(!refresh);
      message.success(t(`descriptions.${titleKey}_description`));
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error(t(`descriptions.${titleKey}_error_description`));
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <Modal
      open={openModals['deleteModal']}
      onCancel={handleCancel}
      onOk={handleDelete}
      title={title}
      width="40%"
      okText={t('buttons.delete')}
      loading={isLoading}
    >
      <p className="!pb-4">
        {t(`deleteModal.selected`)} {deletedIDs?.length} {t(`deleteModal.confirm`)}
      </p>
      <Table
        scroll={{ x: '100%', y: 'calc(100vh - 300px)' }}
        pagination={false}
        t={t}
        columns={columns}
        dataSource={data}
        rowKey="id"
        className="delete_table"
      />
    </Modal>
  );
};
