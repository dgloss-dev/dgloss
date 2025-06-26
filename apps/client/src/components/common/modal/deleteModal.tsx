import { useAppStore } from '@client/store/app.store';
import { Modal } from '@workspace/ui/components/molecules/modal';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Table } from '@workspace/ui/components/organisms/table';
import { ColumnsType } from 'antd/es/table';

interface DeleteModalProps {
  onClose: () => void;
  onDelete: (any: any) => void;
  deletedIDs: any[];
  titleKey: string;
  columns: ColumnsType<any>;
  data: any[];
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  onDelete,
  deletedIDs,
  titleKey,
  columns,
  data,
}) => {
  const { setOpenModalAction, openModals } = useAppStore();

  const handleCancel = () => {
    setOpenModalAction('deleteModal', false);
  };
  const t = useTranslations('common');
  const title = t(`deleteModal.${titleKey}`);
  const handleDelete = async () => {
    await onDelete(deletedIDs);
    setOpenModalAction('deleteModal', false);
  };

  return (
    <Modal
      open={openModals['deleteModal']}
      onCancel={handleCancel}
      onOk={handleDelete}
      title={title}
      width="40%"
      okText={t('buttons.delete')}
    >
      <p className="!pb-4">{t(`deleteModal.${titleKey}_description`)}</p>
      <Table
        scroll={{ x: '100%', y: 'calc(100vh - 300px)' }}
        pagination={false}
        t={t}
        columns={columns}
        dataSource={data}
        rowKey="id"
        className="!custom-table"
      />
    </Modal>
  );
};
