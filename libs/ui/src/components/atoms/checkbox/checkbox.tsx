'use client';

import React, { memo, useCallback } from 'react';
import AntCheckbox from 'antd/es/checkbox';
import ConfigProvider from 'antd/es/config-provider';
import type {
  CheckboxChangeEvent,
  CheckboxGroupProps as AntCheckboxGroupProps,
} from 'antd/es/checkbox';
import { useMemo } from 'react';

interface BaseProps {
  readonly type: 'single' | 'group';
  readonly className?: string;
}

export interface SingleProps extends BaseProps {
  readonly type: 'single';
  readonly label?: string;
  readonly value?: string;
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly onChange?: (e: CheckboxChangeEvent) => void;
  readonly id?: string;
  readonly ariaLabel?: string;
}

export interface GroupProps extends BaseProps {
  readonly type: 'group';
  defaultValue?: string[];
  value?: string[];
  readonly options: Array<{
    readonly label: string;
    readonly value: string;
    readonly disabled?: boolean;
  }>;
  onChange?: (checkedValue: string[]) => void;
  readonly id?: string;
  readonly ariaLabel?: string;
}

export type CheckboxProps = SingleProps | GroupProps;

const themeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorText: '#000000e0',
  },
  components: {
    Checkbox: {
      checkColor: 'var(--color-success)',
      checkBg: 'var(--color-success)',
      colorPrimary: 'var(--color-success)',
      colorPrimaryHover: 'var(--color-success)',
      colorPrimaryActive: 'var(--color-success)',
      checkBorderColor: 'var(--color-success)',
      controlInteractiveSize: 20,
      controlHoverColor: 'var(--color-success)',
      hoverActiveColor: 'var(--color-success)',
      controlActiveColor: 'var(--color-success)',
      fontWeight: 400,
      fontSize: 14,
      lineWidth: 2,
      borderRadiusSM: 6,
      lineWidthBold: 2,
      lineWidthFocus: 2,
      height: 16,
      width: 16,
    },
  },
};

const baseStyles = {
  single: '',
  group: 'custom-checkbox',
} as const;

export const Checkbox: React.FC<CheckboxProps> = memo(
  ({ type = 'single', ...props }: CheckboxProps) => {
    const handleSingleChange = useCallback(
      (onChange?: SingleProps['onChange']) => (e: CheckboxChangeEvent) => {
        const sanitizedEvent = {
          ...e,
          target: {
            ...e.target,
            value: String(e.target.value).trim(),
          },
        };
        onChange?.(sanitizedEvent);
      },
      [],
    );

    const handleGroupChange = useCallback(
      (onChange?: GroupProps['onChange']) => (values: string[]) => {
        const sanitizedValues = values.map((value) => String(value).trim());
        onChange?.(sanitizedValues);
      },
      [],
    );

    const renderComponent = useMemo(() => {
      if (type === 'group') {
        const { options, onChange, className, id, ariaLabel, ...groupProps } = props as GroupProps;

        const sanitizedOptions = options.map((option) => ({
          ...option,
          label: String(option.label).trim(),
          value: String(option.value).trim(),
        }));

        const antGroupProps: AntCheckboxGroupProps = {
          ...groupProps,
          options: sanitizedOptions,
          onChange: handleGroupChange(onChange),
          className: `${baseStyles.group} ${className || ''}`,
        };

        return <AntCheckbox.Group {...antGroupProps} />;
      }

      const { label, onChange, className, id, ariaLabel, ...singleProps } = props as SingleProps;
      return (
        <AntCheckbox
          {...singleProps}
          onChange={handleSingleChange(onChange)}
          className={`${baseStyles.single} ${className || ''}`}
          id={id}
          aria-label={ariaLabel}
        >
          {label && String(label).trim()}
        </AntCheckbox>
      );
    }, [type, props, handleSingleChange, handleGroupChange]);

    return <ConfigProvider theme={themeConfig}>{renderComponent}</ConfigProvider>;
  },
);

Checkbox.displayName = 'Checkbox';
