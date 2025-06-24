import { ICallerPhone } from '../callerPhone';

export interface ICaller {
  id?: number;
  callListId?: number;
  name: string;
  ordinalNum?: number;
  industryType?: string;
  employee?: string;
  annualTradingSession?: string;
  personInCharge?: number;
  callPermission?: boolean;
  url?: string;
  memo?: string;
  phones?: ICallerPhone[];
}
