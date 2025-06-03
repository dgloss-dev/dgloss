import { Router } from 'express';
import { UtilsController } from '../controllers/utils.controller';
import { Authenticate, ValidateRequest } from '../common/middleware';
import { UTILS_APIS } from '@workspace/types/constants/api';
import { getPresignedUrlDtoSchema } from '@workspace/types/dto/utils';

export class UtilsRoutes {
  private utilsController = new UtilsController();
  public router: Router;

  constructor() {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes() {
    // POST /utils/presignurl
    this.router.post(
      `/${UTILS_APIS.PRESIGN_URL}`,
      Authenticate(),
      ValidateRequest(getPresignedUrlDtoSchema),
      this.utilsController.getPresignedUrl,
    );
  }
}
