'use client';
import React, { useState } from 'react';
import AntInput from 'antd/es/input';
import ConfigProvider from 'antd/es/config-provider';
import Image from 'next/image';

type ModeTypes = 'search' | 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal';
export interface InputProps {
  id?: string;
  defaultValue?: string;
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  suffixLabel?: string;
  allowClear?: boolean;
  maxLength?: number;
  showCount?: boolean;
  value?: string | number;
  placeholder?: string;
  name?: string;
  label?: string;
  descriptiveLabel?: string;
  className?: string;
  type?: string;
  errorMessage?: string;
  min?: number;
  theme?: {
    token?: {
      [key: string]: any;
    };
  };
  inputMode?: ModeTypes;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: () => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = (props) => {
  const Component = props.type === 'password' ? AntInput.Password : AntInput;

  return (
    <ConfigProvider
      theme={{
        token: {
          lineType: 'solid',
          colorBgContainer: 'var(--color-primary-light)',
          controlOutlineWidth: 1,
          borderRadius: 6,
          colorBorder: 'var(--color-dust)',
          ...props.theme?.token,
        },
        components: {
          Input: {
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
      <div className="flex flex-col">
        {props.label && (
          <label
            htmlFor={props.id}
            className="mb-1 text-sm text-nowrap font-semibold text-base-light"
          >
            {props.label}
          </label>
        )}

        {props.descriptiveLabel && (
          <h6 className="pb-1 text-xs font-normal md:pb-3">{props.descriptiveLabel}</h6>
        )}

        <Component
          className={`${props.className}  !font-normal no-border-input border !h-[32px] border-solid border-black`}
          size={props.size}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          allowClear={props.allowClear}
          id={props.id}
          maxLength={props.maxLength}
          prefix={props.prefix}
          suffix={props.suffix}
          showCount={props.showCount}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onPressEnter={props.onPressEnter}
          name={props.name}
          type={props.type}
          inputMode={props.inputMode}
          min={props.min}
        />

        {props.suffixLabel && (
          <span className="input-suffix" style={{ marginLeft: '8px' }}>
            {props.suffixLabel}
          </span>
        )}

        {props.errorMessage && (
          <div className="py-2 text-xs font-medium text-secondary">{props.errorMessage}</div>
        )}
      </div>
    </ConfigProvider>
  );
};

export interface SearchInputProps extends InputProps {
  enterButton?: false | React.ReactNode;
  loading?: boolean;
  onSearch?: (value: string) => void;
}

const { Search } = AntInput;

export const SearchInput: React.FC<SearchInputProps> = ({
  size = 'middle',
  className,
  onChange,
  value,
  enterButton = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#007aff',
          lineType: 'solid',
          colorBgContainer: '#ffffff',
          controlOutlineWidth: 1,
          borderRadius: 6,
          colorBorder: '#e5e7eb',
          ...props.theme?.token,
        },
      }}
    >
      <Search
        className={`no-border-input search-input ${className}`}
        size={size}
        value={inputValue}
        onChange={handleInputChange}
        {...props}
      />
    </ConfigProvider>
  );
};
