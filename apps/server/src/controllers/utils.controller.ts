import { Response } from 'express';
import { UtilsService } from '../services';
import { logger } from '../utils/winston.utils';
import { cb, cbError } from '../common/handler';
import { ERRORS } from '../common/constants';
import { GetPresignedUrlDto } from '@workspace/types/dto/utils';
import { HTTPSTATUS } from '@workspace/types/enums/common';
import { AuthenticatedRequest } from '../common/interfaces';

export class UtilsController {
  private utilsService: UtilsService;

  constructor() {
    this.utilsService = UtilsService.getInstance();
  }

  getPresignedUrl = async (req: AuthenticatedRequest, res: Response) => {
    logger.info('UtilsController - getPreSignedUrl()');
    try {
      const userId = req.user.id;
      const body: GetPresignedUrlDto = req.body;
      const result = await this.utilsService.getPresignedUrl(userId?.toString(), body);
      return cb(HTTPSTATUS.OK, res, { url: result });
    } catch (error) {
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
    }
  };
}
