import { CALL_STATUS } from '../../enums/callList';
import { UpdateAICallSlotDto, updateAICallSlotDtoSchema } from '../aiCallSlot';

export const updateCallListDtoSchema = {
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
    aiCallSlots: {
      type: 'array',
      items: updateAICallSlotDtoSchema,
    },
    objectKey: { type: 'string' },
  },
  additionalProperties: false,
};

export interface UpdateCallListDto {
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
  aiCallSlots?: UpdateAICallSlotDto[];
  objectKey?: string;
}
