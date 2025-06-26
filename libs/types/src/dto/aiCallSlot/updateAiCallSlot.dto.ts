export const updateAICallSlotDtoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    startTime: { type: 'string' },
    endTime: { type: 'string' },
  },
  additionalProperties: false,
};

export interface UpdateAICallSlotDto {
  id?: number;
  startTime?: string;
  endTime?: string;
}
