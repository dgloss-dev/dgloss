import { CALL_STATUS } from '../../enums/callList';
import { ICaller } from '../caller';
import { IAiCallSlot } from '../aiCallSlot';

export interface ICallList {
  name: string;
  createdBy: number;
  callStatus: CALL_STATUS;
  voiceDataGroupId: number;
  noAi?: number;
  telNum?: string;
  aiState?: boolean;
  isCallPossible?: boolean;
  callers?: ICaller[];
  aiCallSlots?: IAiCallSlot[];
}
