import { CALL_STATUS } from '../../enums/callList';

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
    objectKey: { type: 'string' },
  },
  additionalProperties: false,
  required: ['name', 'createdBy', 'callStatus', 'voiceDataGroupId'],
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
  objectKey?: string;
}
