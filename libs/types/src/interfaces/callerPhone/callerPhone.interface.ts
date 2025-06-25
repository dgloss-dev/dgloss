import { CALLER_PHONE_SLOT } from '../../enums/callerPhone';

export interface ICallerPhone {
  id?: number;
  phoneNumber: string;
  callerId: number;
  slot: CALLER_PHONE_SLOT;
}
