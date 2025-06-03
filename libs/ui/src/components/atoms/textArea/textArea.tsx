import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import AntInput from 'antd/es/input';

const { TextArea: AntTextArea } = AntInput;

export interface TextAreaProps {
  id?: string;
  defaultValue?: string;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  allowClear?: boolean;
  maxLength?: number;
  showCount?: boolean;
  value?: string;
  placeholder?: string;
  label?: string;
  description?: string;
  className?: string;
  rows?: number;
  autoSize?: boolean | object;
  suffix?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPressEnter?: () => void;
  onSuffixClick?: () => void;
  style?: React.CSSProperties;
}

export const TextArea: React.FC<TextAreaProps> = (props) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: '#f4f4f7',
        },
        components: {
          Input: {
            activeBg: '#f4f4f7',
            activeBorderColor: '#1677ff',
            hoverBg: '#f4f4f7',
            hoverBorderColor: '#4096ff',
          },
        },
      }}
    >
      <div className="relative flex items-center no-border-text-area">
        <AntTextArea
          className={`${props.className} no-border-input`}
          size={props.size}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          allowClear={props.allowClear}
          id={props.id}
          maxLength={props.maxLength}
          showCount={props.showCount}
          value={props.value}
          placeholder={props.placeholder}
          autoSize={props.autoSize}
          rows={props.rows}
          onChange={props.onChange}
          onPressEnter={props.onPressEnter}
          style={props.style}
        />
      </div>
    </ConfigProvider>
  );
};
