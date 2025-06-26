import React from 'react';
import { ConfigProvider, Form } from 'antd';
import { Rule } from 'antd/es/form';
import dayjs from 'dayjs';

const { Item } = Form;
interface FormItemProps {
  label?: string | React.ReactNode;
  name?: string | number;
  colon?: boolean;
  rules?: Rule[];
  dependencies?: string[];
  extra?: React.ReactNode;
  hidden?: boolean;
  initialValue?: string | string[] | boolean | dayjs.Dayjs | number;
  preserve?: boolean;
  required?: boolean;
  labelCol?: { span?: number; offset?: number };
  wrapperCol?: { span?: number; offset?: number };
  layout?: 'horizontal' | 'vertical';
  valuePropName?: string;
  children: React.ReactNode;
  validateFirst?: boolean | 'parallel';
  validateTrigger?: string | string[];
  validateDebounce?: number;
  fullWidth?: boolean;
  className?: string;
  getValueFromEvent?: any;
  normalize?: (value: any) => string;
}
export const FormItem: React.FC<FormItemProps> = ({
  colon = false,
  fullWidth = false,
  className,
  getValueFromEvent,
  ...props
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: 'var(--color-base)',
            labelFontSize: 14,
            fontFamily: 'var(--font-sf-pro)',
            fontSize: 14,
            fontWeightStrong: 600,
            labelRequiredMarkColor: 'var(--color-warning-default)',
          },
        },
      }}
    >
      <Item
        getValueFromEvent={getValueFromEvent}
        className={`${fullWidth ? ' flex-1 !text-sm' : ''} ${className}`}
        colon={colon}
        {...props}
      >
        <div className=" border !w-full border-dust px-4 py-2 min-h-12">
          {props.children}
        </div>
      </Item>
    </ConfigProvider>
  );
};
