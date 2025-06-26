import React from 'react';
import { Button } from '@workspace/ui/components/atoms/button';

type formFooterType = {
  edit?: boolean;
  onClick?: (values?: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
  buttonLabel?: {
    cancel: string;
    submit: string;
  };
  loading?: boolean;
  type?: 'short' | 'long';
};
export const FormFooter = (props: formFooterType) => {
  const {
    onCancel,
    onClick,
    disabled,
    loading,
    buttonLabel = {
      cancel: 'キャンセル',
      submit: '更新',
    },
  } = props;
  return (
    <div className="flex items-center justify-center gap-x-2 w-full mt-8">
      <Button
        type="block"
        variant="primary-outline"
        label={buttonLabel.cancel}
        onClick={onCancel}
        disabled={disabled}
        loading={loading}
        className="!w-full !max-w-[128px]"
      />
      <Button
        type="block"
        variant="primary"
        label={buttonLabel.submit}
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        className="!w-full !max-w-[128px]"
        htmlType="submit"
      />
    </div>
  );
};
