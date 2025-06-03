'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Select as AntSelect, ConfigProvider } from 'antd';
import { BaseSelectRef } from 'rc-select';

interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

interface SelectProps {
  allowClear?: boolean;
  autoClearSearchValue?: boolean;
  className?: string;
  defaultValue?: string | string[] | number | number[];
  disabled?: boolean;
  fullWidth?: boolean;
  id: string;
  listHeight?: number;
  label?: string;
  loading?: boolean;
  maxCount?: number;
  maxTagCount?: number | 'responsive';
  maxTagTextLength?: number;
  mode?: 'multiple' | 'tags';
  notFoundContent?: React.ReactNode;
  open?: boolean;
  optionRender?: (option: any) => React.ReactNode;
  dropdownRender?: (
    menu: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  ) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  options: SelectOption[];
  placeholder?: string;
  placement?: 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';
  showSearch?: boolean;
  size?: 'small' | 'middle' | 'large';
  status?: 'error' | 'warning';
  tokenSeparators?: string[];
  type?: 'outlined' | 'filled' | 'borderless';
  value?: string | string[] | number | number[];
  dropdownStyle?: React.CSSProperties;
  onChange?: (
    value: string | string[] | number | number[] | undefined | (string | number)[],
    option?: any,
  ) => void;
  onClear?: () => void;
  onDeselect?: (value: string | number) => void;
  onSearch?: (value: string | number) => void;
  onSelect?: (value: string | number) => void;
  suffixIcon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  allowClear = false,
  autoClearSearchValue = true,
  listHeight = 256,
  placement = 'bottomLeft',
  type = 'outlined',
  fullWidth = true,
  mode,
  onChange,
  ...props
}) => {
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const [searchValue, setSearchValue] = useState<string>('');
  const [composing, setComposing] = useState<boolean>(false);
  const selectRef = useRef<BaseSelectRef>(null);

  useEffect(() => {
    if (mode === 'tags') {
      const handleCompositionStart = () => {
        setComposing(true);
      };
      const handleCompositionEnd = (event: CompositionEvent) => {
        setComposing(false);
        // const composedValue = event.data;
        // if (composedValue && onChange && mode === 'tags') {
        //   if (
        //     Array.isArray(props.value) &&
        //     composedValue &&
        //     (props.value as string[])?.includes(composedValue)
        //   ) {
        //     setSearchValue('');
        //     return;
        //   }
        //   const newValue = Array.isArray(props.value)
        //     ? [...props.value, composedValue]
        //     : [composedValue];
        //   onChange(newValue, { value: composedValue, label: composedValue });
        //   setSearchValue('');
        // }
      };
      const node = selectRef?.current?.nativeElement;
      if (node) {
        node.addEventListener('compositionstart', handleCompositionStart);
        node.addEventListener('compositionend', handleCompositionEnd);
      }
      return () => {
        if (node) {
          node.removeEventListener('compositionstart', handleCompositionStart);
          node.removeEventListener('compositionend', handleCompositionEnd);
        }
      };
    }
  }, [onChange, props.value, mode]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && mode === 'tags') {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!composing && event.code == 'Space' && mode === 'tags') {
      if (onChange && searchValue.trim() !== '') {
        const newValue = Array.isArray(props.value) ? [...props.value, searchValue] : [searchValue];
        onChange(newValue, { value: searchValue.trim(), label: searchValue });
      }
      setSearchValue('');
    }
  };

  const handleChange = (value: any, option: any) => {
    if (!composing) {
      if (onChange) {
        onChange(value, option);
      }
      setSearchValue('');
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value.trim());
    if (props.onSearch) {
      props.onSearch(value.trim());
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#007aff',
          controlOutlineWidth: 2,
          borderRadius: 6,
        },
        components: {
          Select: {
            clearBg: '#ffffff',
            optionPadding: '5px 12px',
          },
        },
      }}
    >
      {props.label && (
        <label htmlFor={props.id} className="block mb-4 text-sm font-semibold text-text-secondary">
          {props.label}
        </label>
      )}
      <AntSelect
        ref={selectRef}
        allowClear={allowClear}
        autoClearSearchValue={autoClearSearchValue}
        filterOption={filterOption}
        listHeight={listHeight}
        searchValue={searchValue}
        placement={placement}
        variant={type}
        mode={mode}
        onChange={handleChange}
        onSearch={handleSearch}
        onInputKeyDown={handleKeyDown}
        {...props}
        className={`${fullWidth ? 'w-full' : ''} ${
          mode === 'tags' ? 'ant-select-tags' : ''
        }  no-outline ${props.className}`}
      />
    </ConfigProvider>
  );
};
