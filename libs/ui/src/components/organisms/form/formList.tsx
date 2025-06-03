import React from 'react';
import { Form } from 'antd';
import type { Rule as AntdRule, FormListFieldData, FormListOperation } from 'antd/es/form';

type ValidatorRule = AntdRule; // Define alias if necessary

const { List } = Form;

interface FormListProps {
  name: string;
  rules?: ValidatorRule[]; // Ensure this type matches List component's expected type
  children: (
    fields: FormListFieldData[],
    operation: FormListOperation,
    meta: {
      errors: React.ReactNode[];
      warnings: React.ReactNode[];
    },
  ) => React.ReactNode;
}

export const FormList: React.FC<FormListProps> = ({ name, rules = [], children }) => {
  return (
    <List
      name={name}
      //rules={rules}
    >
      {(fields, operation, meta) => children(fields, operation, meta)}
    </List>
  );
};
