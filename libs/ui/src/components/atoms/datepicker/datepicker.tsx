'use client';

import React, { useState } from 'react';
import ConfigProvider from 'antd/es/config-provider';
import AntDatePicker, { DatePickerProps as AntDatePickerProps } from 'antd/es/date-picker';
import { FcCalendar } from 'react-icons/fc';
import dayjs from 'dayjs';
import jaJP from 'antd/es/date-picker/locale/ja_JP';
import 'dayjs/locale/ja';

dayjs.locale('ja');

export interface DatePickerProps extends AntDatePickerProps {
  onChange?: (date: dayjs.Dayjs, dateString: string | string[]) => void;
  format?: string;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  mode?: 'time' | 'date' | 'month' | 'year' | 'decade';
  allowClear?: boolean;
  className?: string;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  open?: boolean;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  size?: 'large' | 'middle' | 'small';
  defaultValue?: dayjs.Dayjs;
  value?: dayjs.Dayjs;
  onOpenChange?: (open: boolean) => void;
  type?: 'input' | 'icon';
}

interface IconDatePickerProps extends DatePickerProps {
  type: 'icon';
  icon?: React.ReactNode;
}

const InputDatePicker: React.FC<DatePickerProps> = ({
  onChange,
  format = 'YYYY-MM-DD',
  picker = 'date',
  ...props
}: DatePickerProps) => {
  return (
    <AntDatePicker onChange={onChange} format={format} picker={picker} locale={jaJP} {...props} />
  );
};

const IconDatePicker: React.FC<IconDatePickerProps> = ({
  onChange,
  format = 'YYYY-MM-DD',
  picker = 'date',
  icon = <FcCalendar size={28} />,
  ...props
}: IconDatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center">
      <div onClick={() => setOpen(!open)}>{icon}</div>
      <AntDatePicker
        open={open}
        onOpenChange={setOpen}
        onChange={onChange}
        format={format}
        picker={picker}
        locale={jaJP}
        className="hidden"
        {...props}
      />
    </div>
  );
};

export const DatePicker: React.FC<DatePickerProps | IconDatePickerProps> = (props) => {
  const datePickerElement =
    props.type === 'icon' ? (
      <IconDatePicker {...(props as IconDatePickerProps)} />
    ) : (
      <InputDatePicker {...(props as DatePickerProps)} />
    );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#ffffff',
        },
        components: {
          Input: {
            activeBg: '#ffffff',
            activeBorderColor: '#1677ff',
          },
        },
      }}
    >
      {datePickerElement}
    </ConfigProvider>
  );
};
