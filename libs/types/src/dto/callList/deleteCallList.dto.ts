export const deleteCallListDtoSchema = {
  type: 'object',
  properties: {
    ids: {
      type: 'array',
      items: { type: 'number' },
      minItems: 1,
    },
  },
  additionalProperties: false,
  required: ['ids'],
};

export interface DeleteCallListDto {
  ids: number[];
}
