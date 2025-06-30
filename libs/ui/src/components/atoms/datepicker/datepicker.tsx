'use client';

import React, { useState } from 'react';
import ConfigProvider from 'antd/es/config-provider';
import AntDatePicker, { DatePickerProps as AntDatePickerProps } from 'antd/es/date-picker';
import { FcCalendar } from 'react-icons/fc';
import dayjs from 'dayjs';
import JP from 'antd/es/date-picker/locale/ja_JP';
import ENG from 'antd/es/date-picker/locale/en_US';
import { ImageIcon } from '../icon/imageIcon';

dayjs.locale('en_US');

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
  activeLocale: string;
  disableTime?: boolean;
}

interface IconDatePickerProps extends DatePickerProps {
  type: 'icon';
  icon?: React.ReactNode;
  activeLocale: string;
}

const disableCurrentTime = (date: dayjs.Dayjs) => {
  const now = dayjs();
  const currentHour = now.hour();
  const currentMinute = now.minute();

  if (date && date.isSame(now, 'day')) {
    return {
      disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
      disabledMinutes: (selectedHour: number) =>
        selectedHour === currentHour ? Array.from({ length: currentMinute }, (_, i) => i) : [],
    };
  }

  return {
    disabledHours: () => [],
    disabledMinutes: () => [],
  };
};

const InputDatePicker: React.FC<DatePickerProps> = ({
  onChange,
  format = 'YYYY-MM-DD',
  picker = 'date',
  activeLocale,
  disableTime,
  ...props
}: DatePickerProps) => {
  return (
    <AntDatePicker
      onChange={onChange}
      format={format}
      picker={picker}
      locale={activeLocale === 'en' ? ENG : JP}
      disabledTime={disableTime ? disableCurrentTime : undefined}
      inputReadOnly={true}
      className="!w-[100px]"
      showNow={false}
      suffixIcon={<ImageIcon path="actions/chevronDown.svg" />}
      {...props}
    />
  );
};

const IconDatePicker: React.FC<IconDatePickerProps> = ({
  onChange,
  format = 'YYYY-MM-DD',
  picker = 'date',
  icon = <FcCalendar size={28} />,
  activeLocale,
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
        locale={activeLocale === 'en' ? ENG : JP}
        inputReadOnly={true}
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
          lineType: 'solid',
          colorBgContainer: 'var(--color-primary-light)',
          controlOutlineWidth: 1,
          borderRadius: 6,
          colorBorder: 'var(--color-dust)',
          colorPrimary: '#1677ff',
          colorPrimaryHover: '#1677ff',
        },
        components: {
          DatePicker: {
            paddingBlock: 5,
            paddingInline: 11,
            activeBg: 'var(--color-primary-light)',
            activeBorderColor: 'var(--color-dust)',
            hoverBg: 'var(--color-primary-light)',
            hoverBorderColor: 'var(--color-dust)',
            controlHeight: 32,
            controlHeightSM: 32,
            controlHeightLG: 32,
            controlHeightXS: 32,
          },
        },
      }}
    >
      {datePickerElement}
    </ConfigProvider>
  );
};
