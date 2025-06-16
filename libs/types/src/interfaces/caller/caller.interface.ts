import { CallerPhone } from '../callerPhone';

export interface ICaller {
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
  phones?: CallerPhone[];
}
