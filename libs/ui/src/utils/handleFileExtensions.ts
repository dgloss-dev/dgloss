interface MimeTypeMap {
  [key: string]: string;
}

const allowedThumbnailMimeTypes: MimeTypeMap = {
  'image/jpeg': 'jpg', // JPG
  'image/png': 'png', // PNG
  'image/webp': 'webp', // WEBP
  'image/heic': 'heic', // HEIC
};

const allowedVideosMimeTypes: MimeTypeMap = {
  'video/mp4': 'mp4', // MOV, MP4
  'video/webm': 'webm', // WebM
  'video/x-matroska': 'mkv', // MKV
  'video/quicktime': 'mov', // MOV
  'video/mpeg': 'mpeg', // MPEG, MPG
};

export const getFileExtension = (mimeType: string) => {
  const mimeTypes: MimeTypeMap = {
    'video/mp4': 'mp4', // MOV, MP4
    'video/webm': 'webm', // WebM
    'video/x-matroska': 'mkv', // MKV
    'video/quicktime': 'mov', // MOV
    'video/avi': 'avi', // AVI
    'video/mpeg': 'mpeg', // MPEG, MPG
    'image/jpeg': 'jpg', // JPG
    'image/png': 'png', // PNG
    'image/webp': 'webp', // WEBP
    'image/heic': 'heic', // HEIC
  };

  return mimeTypes[mimeType] || 'unknown';
};

function getFileExtensionUrl(url: string) {
  return url.includes('blob') ? 'mp4' : isAppleDevice() ? 'm3u8' : 'mpd';
}

export const getMIMEType = (url: string) => {
  const mimeTypes: MimeTypeMap = {
    mp4: 'video/mp4',
    m3u8: 'application/x-mpegURL',
    mpd: 'application/dash+xml',
  };
  return mimeTypes[getFileExtensionUrl(url)] || 'unknown';
};

export const isAllowedVideoType = (mimeType: string): boolean => {
  return !!allowedVideosMimeTypes[mimeType]; // Return true if the MIME type exists, otherwise false
};

export const isAllowedImageType = (mimeType: string): boolean => {
  return !!allowedThumbnailMimeTypes[mimeType]; // Return true if the MIME type exists, otherwise false
};

export const isAppleDevice = () => {
  return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
};

export const getVideoFileUrl = (url: string) => {
  if (url.includes('blob')) {
    return url;
  } else {
    const fileExtension = getFileExtensionUrl(url);
    return `${url}.${fileExtension}`;
  }
};
