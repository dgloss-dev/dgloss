import React from 'react';

interface ScrollableContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollableContent: React.FC<ScrollableContentProps> = ({
  children,
  className = '',
}) => <div className={`flex gap-4 overflow-x-auto hide-scrollbar ${className}`}>{children}</div>;
