export const paginationDtoSchema = {
  type: 'object',
  properties: {
    start: { type: 'number' },
    limit: { type: 'number' },
    sortBy: { type: 'string' },
    order: { type: 'number', enum: [1, -1] },
  },
  additionalProperties: false,
};

export interface IPagination {
  start?: number;
  limit?: number;
  sortBy?: string;
  order?: 1 | -1;
}
