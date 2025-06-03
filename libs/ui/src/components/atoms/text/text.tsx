import React from 'react';

interface TextProps {
  children?: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Text: React.FC<TextProps> = ({ children, className, level }) => {
  const renderTextContent = () => {
    return <span>{children}</span>;
  };

  switch (level) {
    case 1:
      return (
        <h1 className={`${className} text-[17px] lg:text-[20px] font-bold`}>
          {renderTextContent()}
        </h1>
      );
    case 2:
      return <h2 className={className}>{renderTextContent()}</h2>;
    case 3:
      return <h3 className={className}>{renderTextContent()}</h3>;
    case 4:
      return <h4 className={className}>{renderTextContent()}</h4>;
    case 5:
      return <h5 className={className}>{renderTextContent()}</h5>;
    case 6:
      return <h6 className={className}>{renderTextContent()}</h6>;
    default:
      return <p className={className}>{renderTextContent()}</p>;
  }
};
