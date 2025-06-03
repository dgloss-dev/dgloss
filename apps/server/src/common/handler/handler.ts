import { Response } from 'express';
import { logger } from '../../utils/winston.utils';
import { IError } from '../interfaces';
import { HTTPSTATUS } from '@workspace/types/enums/common';

export const cb = (code: HTTPSTATUS, res: Response, responseData: any, isWrapWithData = true) => {
  let response;
  if (responseData) {
    if (isWrapWithData) {
      response = { data: responseData };
    } else {
      response = responseData;
    }
  }
  res.status(code).json(response);
};
export const cbError = (res: Response, code: HTTPSTATUS, type: IError, error: any = '') => {
  const errorContent = {
    code,
    key: type.key,
    message: type.message,
    error: error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : '',
  };

  logger.error(errorContent);
  res.status(code).json({ error: errorContent });
};
