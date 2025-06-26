export const createCallerDtoSchema = {
  type: 'object',
  properties: {
    callListId: { type: 'number' },
    name: { type: 'string', maxLength: 100 },
    ordinalNum: { type: 'number' },
    industryType: { type: 'string', maxLength: 255 },
    employee: { type: 'string', maxLength: 255 },
    annualTradingSession: { type: 'string', maxLength: 255 },
    personInCharge: { type: 'number' },
    callPermission: { type: 'boolean', default: false },
    url: { type: 'string', maxLength: 500 },
    memo: { type: 'string' },
    targetId: { type: 'number' },
    phoneNumberOne: { type: 'string', maxLength: 50 },
    phoneNumberTwo: { type: 'string', maxLength: 50 },
    phoneNumberThree: { type: 'string', maxLength: 50 },
  },
  additionalProperties: false,
  required: ['name'],
};

export interface CreateCallerDto {
  targetId?: number;
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
  phoneNumberOne?: string;
  phoneNumberTwo?: string;
  phoneNumberThree?: string;
}
