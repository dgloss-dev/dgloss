import React from 'react';
import { Text } from '../text';

interface NoDataMessageProps {
  message: string;
}

export const NoDataMessage: React.FC<NoDataMessageProps> = ({ message }) => (
  <div className="w-full flex items-center justify-center min-h-[200px]">
    <Text className="text-xl font-semibold text-text-secondary">{message}</Text>
  </div>
);
