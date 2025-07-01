export const getAllMonths = () => [
  { label: '1月', key: '1' },
  { label: '2月', key: '2' },
  { label: '3月', key: '3' },
  { label: '4月', key: '4' },
  { label: '5月', key: '5' },
  { label: '6月', key: '6' },
  { label: '7月', key: '7' },
  { label: '8月', key: '8' },
  { label: '9月', key: '9' },
  { label: '10月', key: '10' },
  { label: '11月', key: '11' },
  { label: '12月', key: '12' },
];

export const getCurrentMonth = () => new Date().getMonth() + 1;
export const getCurrentYear = () => new Date().getFullYear();

export const formatDateWithTime = (date: Date) => {
  return date?.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
