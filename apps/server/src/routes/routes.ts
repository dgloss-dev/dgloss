import { Application, Router } from 'express';
import { ERRORS } from '../common/constants';
import { cb, cbError } from '../common/handler';
import { AppConfig } from '../config';
import { UtilsRoutes } from './utils.routes';
import { APIS } from '@workspace/types/constants/api';
import { HTTPSTATUS } from '@workspace/types/enums/common';
import UsersRoutes from './user.routes';

export async function SetRoutes(app: Application) {
  const apiRouter = Router();

  app.use('/health', (req, res) => {
    return cb(HTTPSTATUS.OK, res, {
      status: 'OK',
      version: AppConfig.APP_VERSION,
    });
  });

  app.use('/api', apiRouter);
  apiRouter.use(`/${APIS.USERS}`, new UsersRoutes().router);
  apiRouter.use(`/${APIS.UTILS}`, new UtilsRoutes().router);

  app.use((req, res) => {
    return cbError(res, HTTPSTATUS.NOT_FOUND, ERRORS.API_NOT_FOUND, { endPoint: req.path });
  });
}
