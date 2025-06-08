import { CALL_STATUS } from '../../enums/callList';

export interface ICallList {
  name: string;
  createdBy: number;
  callStatus: CALL_STATUS;
  voiceDataGroupId: number;
  noAi?: number;
  telNum?: string;
  aiState?: boolean;
  isCallPossible?: boolean;
}
