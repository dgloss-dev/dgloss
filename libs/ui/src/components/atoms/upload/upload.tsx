'use client';
import React from 'react';
import { Upload as AntUpload, UploadProps as AntUploadProps } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

const { Dragger } = AntUpload;

type BeforeUploadValueType = void | boolean | string | Blob | File;

export interface UploadProps<T = any> extends Pick<AntUploadProps, 'capture' | 'hasControlInside'> {
  name?: string;
  label?: string;
  multiple?: boolean;
  className?: string;
  errorMessage?: string;
  draggable?: boolean;
  children?: React.ReactNode;
  showUploadList?: boolean;
  onChange?: (info: UploadChangeParam<UploadFile<T>>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  beforeUpload?: (
    file: RcFile,
    fileList: RcFile[],
  ) => BeforeUploadValueType | Promise<BeforeUploadValueType>;
  customRequest?: (options: RcCustomRequestOptions<T>) => void;
  accept?: string;
  fileList?: any[];
}

export { RcCustomRequestOptions };

export const Upload: React.FC<UploadProps> = ({
  name,
  label,
  className,
  errorMessage,
  draggable = false,
  children,
  multiple,
  showUploadList,
  accept,
  ...props
}) => {
  const UploadComponent = draggable ? Dragger : AntUpload;

  return (
    <>
      {label && <label className="block mb-4 text-sm font-semibold text-gray-600">{label}</label>}
      <UploadComponent accept={accept} className={`${className} no-border-upload`} {...props}>
        {children}
      </UploadComponent>
      {errorMessage && (
        <div className="py-2 text-xs font-medium text-secondary">{errorMessage}</div>
      )}
    </>
  );
};
