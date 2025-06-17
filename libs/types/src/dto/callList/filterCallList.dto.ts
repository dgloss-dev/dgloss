export const filterCallListDtoSchema = {
  type: 'object',
  properties: {
    start: { type: 'number' },
    limit: { type: 'number' },
    sortBy: { type: 'string' },
    order: { type: 'number', enum: [1, -1] },
    name: { type: 'string' },
  },
  additionalProperties: false,
};

export interface FilterCallListDto {
  start?: number;
  limit?: number;
  sortBy?: string;
  order?: number;
  name?: string;
}
