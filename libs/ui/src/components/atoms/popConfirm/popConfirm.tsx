import React from 'react';
import AntdPopConfirm from 'antd/es/popconfirm';

type popConfirmType = {
  onConfirm: () => void;
  children: React.ReactNode;
};
export const PopConfirm = (props: popConfirmType) => {
  return (
    <AntdPopConfirm title=" 削除しますか？" onConfirm={props.onConfirm}>
      {props.children}
    </AntdPopConfirm>
  );
};
