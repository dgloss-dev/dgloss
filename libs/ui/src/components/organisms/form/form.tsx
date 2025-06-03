'use client';
import React, { useEffect } from 'react';
import AntForm from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';

interface FormProps {
  disabled?: boolean;
  initialValues?: Record<string, any>; // Assuming initialValues is a key-value object
  labelWrap?: boolean;
  labelCol?: { span?: number; offset?: number; flex?: string | number };
  wrapperCol?: { span?: number; offset?: number; flex?: string | number };
  layout?: 'horizontal' | 'vertical' | 'inline';
  name?: string;
  labelAlign?: 'left' | 'right';
  preserve?: boolean;
  scrollToFirstError?: boolean;
  size?: 'small' | 'middle' | 'large';
  variant?: 'outlined' | 'filled' | 'borderless';
  onFieldsChange?: (changedFields: any[], allFields: any[]) => void;
  onFinish?: (values: any) => void;
  onFinishFailed?: (errorInfo: any) => void;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  clearOnDestroy?: boolean;
  validateMessages?: any;
  form?: any;
  children: React.ReactNode;
  requiredMark?: boolean;
  validateTrigger?: string | string[];
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  variant = 'outlined',
  layout = 'vertical',
  ...props
}) => {
  const [myform] = useForm();
  useEffect(() => {
    if (props.initialValues) {
      myform.setFieldsValue(props.initialValues);
    }
  }, [props.initialValues, myform]);

  return (
    <AntForm
      form={props.form ? props.form : myform}
      initialValues={props.initialValues}
      className={props.className ? props.className : ' w-full'}
      layout={layout}
      variant={variant}
      {...props}
    >
      {props.children}
    </AntForm>
  );
};

export { useForm };
