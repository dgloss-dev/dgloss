export const handleZipCodeChange = (value: string) => {
  const rawValue = value.replace(/[^0-9]/g, '');
  const formattedValue = rawValue.length > 7 ? `${rawValue.slice(0, 7)}` : rawValue;
  return formattedValue;
};

export const handlePhoneNumberChange = (value: string) => {
  return value.replace(/[^0-9+]/g, '');
};
