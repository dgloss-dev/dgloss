export const getPresignedUrlDtoSchema = {
  type: 'object',
  properties: {
    bucket: { type: 'string' },
    key: { type: 'string' },
    isAppendUserId: { type: 'boolean' },
  },
  additionalProperties: false,
  required: ['bucket', 'key'],
};

export interface GetPresignedUrlDto {
  bucket: string;
  key: string;
  isAppendUserId?: boolean;
}
