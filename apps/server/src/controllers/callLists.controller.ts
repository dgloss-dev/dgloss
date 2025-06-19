import { CreateCallListDto, FilterCallListDto } from '@workspace/types/dto/callList';
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

  getAllCallLists = async (req: Request, res: Response) => {
    logger.info('CallListsController - getAllCallLists()');

    try {
      const filters: FilterCallListDto = {
        start: parseInt(req?.query?.start as string, 10) || 0,
        limit: parseInt(req?.query?.limit as string, 10) || Number.MAX_SAFE_INTEGER,
        sortBy: (req?.query?.sortBy as string) || 'createdAt',
        order: parseInt(req?.query?.order as string, 10) as 1 | -1,
        name: (req?.query?.name as string) || '',
      };

      const result = await this.callListsService.getAllCallLists(filters);
      return cb(HTTPSTATUS.OK, res, result);
    } catch (error) {
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
    }
  };

  getCallListDetails = async (req: Request, res: Response) => {
    logger.info('CallListsController - getCallListDetails()');
    try {
      const id = parseInt(req.params?.id, 10);
      const callListDetails = await this.callListsService.getCallListDetails(id);

      if (!callListDetails) {
        return cbError(res, HTTPSTATUS.NOT_FOUND, ERRORS.NOT_FOUND, null);
      }

      return cb(HTTPSTATUS.OK, res, callListDetails);
    } catch (error) {
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
    }
  };
}
