import React from 'react';
import { MdErrorOutline } from 'react-icons/md';

import ConfigProvider from 'antd/es/config-provider';
import { Modal } from '../modal';
import { Col, Row } from '../grid';
import { Icon } from '../../atoms/icon';
import { Button } from '../../atoms/button';
import { Text } from '../../atoms/text';

interface IConfirmationModalProps {
  type?: 'delete' | 'cancel' | 'default' | 'success';
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title: string;
  bodyText?: string;
  cancelBtnLabel: string;
  okBtnLabel?: string;
  isBtnLoading?: boolean;
}

export const ConfirmationModal: React.FC<IConfirmationModalProps> = ({
  open,
  title,
  bodyText,
  cancelBtnLabel,
  okBtnLabel,
  onSuccess,
  onClose,
  type,
  isBtnLoading,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          screenXSMax: 480,
          screenSMMin: 480,
        },
      }}
    >
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        closable={false}
        destroyOnClose={true}
        className={`
        extended-save-confirmation-modal
        !fixed
        inset-0
        !p-3 sm:!p-0
        max-xs:!m-0
        !max-w-full
        xs:!max-w-[416px]
        !place-content-center`}
      >
        <Row justify="start" align="top" className="mb-0 header-row">
          {type && (
            <Col xs={2} sm={1}>
              {(type === 'cancel' || type === 'delete') && (
                <MdErrorOutline fontSize={24} color={'#FAAD14'} />
              )}
              {type === 'success' && <Icon name="CircleCheck" size={24} color={'#52C41A'} />}
            </Col>
          )}

          <Col xs={22} sm={23} className="text-start">
            <Text className="font-semibold ml-5 mb-2 !text-lg">{title}</Text>
            <Text className="ml-5 !text-sm">{bodyText}</Text>
          </Col>
        </Row>
        <Row justify="end" className="!mt-6">
          <Col className="!mr-0 !pr-0">
            <Button
              className="!rounded-xl !max-w-[130px]"
              variant="secondary"
              label={cancelBtnLabel}
              type="outlined"
              onClick={onClose}
            />
          </Col>
          {!(type === 'success') && (
            <Col>
              <Button
                className="!rounded-xl !max-w-[130px] !bg-secondary"
                variant="warning"
                type="block"
                label={okBtnLabel}
                onClick={onSuccess}
                loading={isBtnLoading}
              />
            </Col>
          )}
        </Row>
      </Modal>
    </ConfigProvider>
  );
};
