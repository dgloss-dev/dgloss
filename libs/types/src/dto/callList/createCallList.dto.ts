import { CALL_STATUS } from '../../enums/callList';
import { CreateCallTimeSlotDto, createCallTimeSlotDtoSchema } from './createCallTimeSlot.dto';

export const createCallListDtoSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    createdBy: { type: 'number' },
    callStatus: { type: 'string', enum: Object.values(CALL_STATUS) },
    voiceDataGroupId: { type: 'number' },
    noAi: { type: 'number' },
    telNum: { type: 'string', maxLength: 50 },
    aiState: { type: 'boolean', default: false },
    isCallPossible: { type: 'boolean' },
    description: { type: 'string' },
    remarks: { type: 'string' },
    callTimeSlots: {
      type: 'array',
      items: createCallTimeSlotDtoSchema,
    },
    objectKey: { type: 'string' },
  },
  additionalProperties: false,
  required: ['name', 'createdBy', 'callStatus', 'voiceDataGroupId'],
};

export interface CreateCallListDto {
  name: string;
  createdBy: number;
  callStatus: CALL_STATUS;
  voiceDataGroupId: number;
  noAi?: number;
  telNum?: string;
  aiState?: boolean;
  isCallPossible?: boolean;
  description?: string;
  remarks?: string;
  callTimeSlots?: CreateCallTimeSlotDto[];
  objectKey?: string;
}
