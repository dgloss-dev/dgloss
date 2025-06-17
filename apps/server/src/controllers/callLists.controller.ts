import { CreateCallListDto } from '@workspace/types/dto/callList';
import { CallListsService } from '../services/callLists.service';
import { logger } from '../utils/winston.utils';
import { cb, cbError } from '../common/handler';
import { HTTPSTATUS } from '@workspace/types/enums/common';
import { ERRORS } from '../common/constants';
import { Request, Response } from 'express';

export class CallListsController {
  private callListsService: CallListsService;

  constructor() {
    this.callListsService = CallListsService.getInstance();
  }

  createCallList = async (req: Request, res: Response) => {
    logger.info('CallListsController - createCallList()');

    try {
      const data: CreateCallListDto = req.body;
      const createdCallList = await this.callListsService.createCallList(data);
      return cb(HTTPSTATUS.CREATED, res, createdCallList);
    } catch (error: any) {
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.CREATE_FAILED, error);
    }
  };
}
