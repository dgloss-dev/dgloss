import { Input } from '@workspace/ui/components/atoms/input';
import { Switch } from '@workspace/ui/components/atoms/switch';
import { TextArea } from '@workspace/ui/components/atoms/textArea';
import { FormItem, Rule } from '@workspace/ui/components/organisms/form';
import { Checkbox } from '@workspace/ui/components/atoms/checkbox';

interface BasicInputProps {
  label: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  rules?: Rule[];
  className?: string;
}

interface ToggleSwitchProps {
  name: string;
  label: string;
  onChange: (checked: boolean) => void;
  rules?: Rule[];
}

interface TextAreaInputProps {
  name: string;
  label: string;
  placeholder: string;
  rows?: number;
  rules?: Rule[];
  className?: string;
}

interface CheckboxInputProps {
  name: string;
  label: string;
  options: any[];
  rules?: Rule[];
  onChange?: (value: any) => void;
}

export const BasicInput: React.FC<BasicInputProps> = ({
  label,
  name,
  placeholder,
  disabled = false,
  rules,
}) => (
  <FormItem name={name} label={label} layout="horizontal" rules={rules}>
    <Input disabled={disabled} placeholder={placeholder} />
  </FormItem>
);

export const BasicNumberInput: React.FC<BasicInputProps> = ({
  label,
  name,
  placeholder,
  disabled = false,
  min,
  max,
  rules,
  className,
}) => (
  <FormItem name={name} label={label} layout="horizontal" rules={rules}>
    <Input
      type="number"
      disabled={disabled}
      placeholder={placeholder}
      min={min}
      max={max}
      className={className}
    />
  </FormItem>
);

export const TextAreaInput: React.FC<TextAreaInputProps> = ({
  name,
  label,
  placeholder,
  rows,
  rules,
  className,
}) => (
  <FormItem name={name} label={label} layout="horizontal" rules={rules}>
    <TextArea autoSize rows={rows ?? 0} placeholder={placeholder} className={className} />
  </FormItem>
);

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ name, label, onChange, rules }) => (
  <FormItem name={name} label={label} valuePropName="checked" layout="horizontal" rules={rules}>
    <Switch onChange={onChange} />
  </FormItem>
);
