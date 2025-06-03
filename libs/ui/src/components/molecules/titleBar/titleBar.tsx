import { Header } from 'antd/es/layout/layout';

type Prop = {
  title: string;
};
export const TitleBar = (props: Prop) => {
  return <Header className="!text-white !bg-primary px-4 lg:px-28 font-bold">{props.title}</Header>;
};
