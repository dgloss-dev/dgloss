'use client';
import React, { useEffect } from 'react';
import AntForm from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';
import { ConfigProvider } from 'antd';
import { useTranslations } from 'next-intl';
import { Rule } from 'antd/es/form';

type FormLayout = 'horizontal' | 'vertical' | 'inline';
type FormVariant = 'outlined' | 'filled' | 'borderless';
type FormSize = 'small' | 'middle' | 'large';
interface FormProps {
  disabled?: boolean;
  initialValues?: Record<string, any>; // Assuming initialValues is a key-value object
  labelWrap?: boolean;
  labelCol?: { span?: number; offset?: number; flex?: string | number };
  wrapperCol?: { span?: number; offset?: number; flex?: string | number };
  layout?: FormLayout;
  name?: string;
  labelAlign?: 'left' | 'right';
  preserve?: boolean;
  scrollToFirstError?: boolean;
  size?: FormSize;
  variant?: FormVariant;
  onFieldsChange?: (changedFields: any[], allFields: any[]) => void;
  onFinish?: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
  onValuesChange?: (changedValues?: any, allValues?: any) => void;
  clearOnDestroy?: boolean;
  validateMessages?: any;
  form?: any;
  children: React.ReactNode;
  requiredMark?: boolean;
  validateTrigger?: string | string[];
  className?: string;
  onKeyPress?: (e?: any) => void;
}

export const Form: React.FC<FormProps> = ({
  variant = 'outlined',
  layout = 'vertical',
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {},
        },
      }}
    >
      <AntForm
        form={props.form}
        initialValues={props.initialValues}
        className={props.className ? props.className : ' w-full flex'}
        layout={layout}
        variant={variant}
        scrollToFirstError
        onKeyDown={props.onKeyPress}
        onChange={props.onValuesChange && props?.onValuesChange}
        autoComplete="off"
      >
        {props.children}
      </AntForm>
    </ConfigProvider>
  );
};

export { useForm };
export type { Rule };
