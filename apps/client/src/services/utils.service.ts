import { BACKEND_BASE_URL, CONTENT_BUCKET } from '@workspace/types/constants/config';
import { APIS, UTILS_APIS } from '@workspace/types/constants/api';
import { httpPost } from './httpClient.service';
import axios from 'axios';

const URL = `${BACKEND_BASE_URL}/${APIS.UTILS}`;

export const getPresignedUrl = async (request: any) => {
  try {
    const response = await httpPost(`${URL}/${UTILS_APIS.PRESIGN_URL}`, request);
    const data = response?.data;
    return data;
  } catch (error) {
    console.error('Error fetching presigned URL:', error);
    throw error;
  }
};
export const multipartUploadToS3 = async (
  preSignedUrl: string,
  selectedFile: File,
  imageName: string,
  cancelTokenSource?: any,
  onProgress?: (progress: number) => void,
) => {
  try {
    const contentType = selectedFile.type || 'application/octet-stream';

    const response = await axios.put(preSignedUrl, selectedFile, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${imageName}"`,
      },
      cancelToken: cancelTokenSource?.token,
      onUploadProgress: (progressEvent) => {
        if (progressEvent && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) {
            onProgress(progress);
          }
        }
      },
    });

    if (response.status === 200) {
      const eTag = response.headers['etag'];
      if (eTag) {
        const eTagWithoutQuotes = eTag.replace(/"/g, '');
        return eTagWithoutQuotes;
      }

      return true;
    } else {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

export const uploadToS3 = async (
  file: any,
  fileName: string,
  name: string,
  bucketName?: string,
): Promise<void> => {
  try {
    const valueKey = `${name}/${fileName}`;
    const requestFile = {
      bucket: bucketName || CONTENT_BUCKET,
      key: valueKey,
    };

    const filePresignedUrl = await getPresignedUrl(requestFile);

    if (filePresignedUrl) {
      const fileToUpload = file.originFileObj || file;
      await uploadToS3(filePresignedUrl.data.url, fileToUpload, fileName);
    } else {
      throw new Error('Failed to get presigned URL for the file.');
    }
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};
