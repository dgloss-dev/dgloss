export const createCallTimeSlotDtoSchema = {
  type: 'object',
  properties: {
    startTime: { type: 'string' },
    endTime: { type: 'string' },
  },
  additionalProperties: false,
  required: ['startTime', 'endTime'],
};

export interface CreateCallTimeSlotDto {
  startTime: string;
  endTime: string;
}
