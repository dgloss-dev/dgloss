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
  },
  additionalProperties: false,
  required: ['name'],
};

export interface CreateCallerDto {
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
}
