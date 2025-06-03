'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';

interface FallbackImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: string;
  objectFit?: string;
  className?: string;
  onClick?: () => void;
  fill?: boolean;
  style?: React.CSSProperties;
}

export const FallbackImage: React.FC<FallbackImageProps> = React.memo(
  ({
    src,
    fallbackSrc = `/api/placeholder/100/100`,
    alt,
    width,
    height,
    layout,
    objectFit,
    className,
    onClick,
    fill,
    style,
  }) => {
    const [imageSrc, setImageSrc] = useState(src);

    const handleImageError = () => {
      if (imageSrc !== fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
    };

    return (
      <Image
        src={imageSrc}
        onClick={onClick}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        objectFit={objectFit}
        className={className}
        onError={handleImageError}
        placeholder="blur"
        fill={fill}
        style={style}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAMYAAAAAAIAAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAFA4PEg8NFBIQEhcVFBgeMiEeHBwZJSstJDJJWlFWVDM9YXVtdmyAsbPE4ubm8czKtbDXvtza/////////////9sAQQUVFRgWGDEhITHC/8z///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AARCAAIAAQAMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJgADf/Z"
      />
    );
  },
);
