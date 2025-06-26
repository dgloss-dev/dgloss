import React, { Suspense, lazy } from 'react';
import { iconMap } from '../../../icons/iconMap';

interface IconProps {
  name: keyof typeof iconMap;
  size?: number;
  color?: string;
  className?: string;
}

const IconFallback = ({ size = 16 }: { size?: number }) => (
  <div className="animate-pulse bg-gray-200 rounded-sm" style={{ width: size, height: size }} />
);

export const Icon = ({ name, size = 16, color, className }: IconProps) => {
  const IconComponent = lazy(iconMap[name]);

  return (
    <Suspense fallback={<IconFallback size={size} />}>
      <IconComponent size={size} color={color} className={className} />
    </Suspense>
  );
};
