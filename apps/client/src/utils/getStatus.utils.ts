import { CALL_MODES, CALL_STATUS } from '@workspace/types/enums/callList';

export const getCallStatusType = (status: CALL_STATUS) => {
  switch (status) {
    case CALL_STATUS.ON_CALL:
      return;
    case CALL_STATUS.CALL_SUSPENDED:
      return CALL_MODES.PAUSE;
    case CALL_STATUS.MANUAL_STOP:
      return CALL_MODES.INACTIVE;
    case CALL_STATUS.COMPLETED:
      return CALL_MODES.INACTIVE;
    default:
      return CALL_MODES.INACTIVE;
  }
};

export const getCallStatusLabel = (status: CALL_STATUS, callListTexts: any) => {
  switch (status) {
    case CALL_STATUS.ON_CALL:
      return callListTexts('table.aiCalling');
    case CALL_STATUS.CALL_SUSPENDED:
      return callListTexts('table.aiStopped');
    case CALL_STATUS.MANUAL_STOP:
      return callListTexts('table.aiStopped');
    case CALL_STATUS.COMPLETED:
      return callListTexts('table.aiStopped');
    default:
      return status;
  }
};
