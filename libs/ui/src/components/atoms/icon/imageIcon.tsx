import Image from 'next/image';

interface ImageIconProps {
  path: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const ImageIcon = ({ path, size = 16, className = '', alt = 'icon' }: ImageIconProps) => {
  const imagePath = `/images/icons/${path}`;

  return (
    <Image
      src={imagePath}
      alt={alt}
      width={size}
      height={size}
      className={`${className} !max-w-none`}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
      }}
    />
  );
};
