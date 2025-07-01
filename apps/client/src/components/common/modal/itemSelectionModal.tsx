import { useAppStore } from '@client/store/app.store';
import { Modal } from '@workspace/ui/components/molecules/modal';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Table } from '@workspace/ui/components/organisms/table';
import { ColumnsType } from 'antd/es/table';
import { MODAL_KEY } from '@client/constants/modalKey.constant';
import { useMessage } from '@workspace/ui/components/atoms/message';

type ItemSelectionModalType = 'delete' | 'prohibited';
interface ItemSelectionModal {
  onClose: () => void;
  apiFunc: (any: any) => void;
  selectedIds: any[];
  titleKey: string;
  columns: ColumnsType<any>;
  data: any[];
  setSelectedRows: (selectedRows: any[]) => void;
  type?: ItemSelectionModalType;
}

export const ItemSelectionModal: React.FC<ItemSelectionModal> = ({
  apiFunc,
  selectedIds,
  titleKey,
  columns,
  data,
  setSelectedRows,
  type = 'delete' as ItemSelectionModalType,
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
    setOpenModalAction(
      type === 'delete' ? MODAL_KEY.DELETE_MODAL : MODAL_KEY.PROHIBITED_MODAL,
      false,
    );
  };
  const t = useTranslations('common');
  const title = type === 'delete' ? t(`deleteModal.${titleKey}`) : t(`prohibitedModal.${titleKey}`);

  const message = useMessage();
  const handleDelete = async () => {
    try {
      setIsLoadingAction(true);
      await apiFunc(selectedIds);
      setOpenModalAction(
        type === 'delete' ? MODAL_KEY.DELETE_MODAL : MODAL_KEY.PROHIBITED_MODAL,
        false,
      );
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
      open={type === 'delete' ? openModals['deleteModal'] : openModals['prohibitedModal']}
      onCancel={handleCancel}
      onOk={handleDelete}
      title={title}
      width="40%"
      okText={type === 'delete' ? t('buttons.delete') : t('buttons.prohibited')}
      loading={isLoading}
    >
      <p className="!pb-4">
        {t(`${type}Modal.selected`)} {selectedIds?.length} {t(`${type}Modal.confirm`)}
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
