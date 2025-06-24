export const createAICallSlotDtoSchema = {
  type: 'object',
  properties: {
    startTime: { type: 'string' },
    endTime: { type: 'string' },
  },
  additionalProperties: false,
  required: ['startTime', 'endTime'],
};

export interface CreateAICallSlotDto {
  startTime: string;
  endTime: string;
}
