export const filterUserDtoSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    start: { type: 'number' },
    limit: { type: 'number' },
    sortBy: { type: 'string' },
    order: { type: 'number', enum: [1, -1] },
  },
  additionalProperties: false,
};

export interface FilterUserDto {
  username: string;
  email: string;
  start?: number;
  limit?: number;
  sortBy?: string;
  order?: 1 | -1;
}
