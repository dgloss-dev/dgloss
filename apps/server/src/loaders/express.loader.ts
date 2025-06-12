import { Application } from 'express';
import bodyParser from 'body-parser';

import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import * as rfs from 'rotating-file-stream';

import { AppConfig } from '../config';
import { ENVIRONMENTS } from '../common/constants';
import { SetRoutes } from '../routes/routes';

export class ExpressLoader {
  constructor(private app: Application) {
    this.app = app;
  }

  loadMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(helmet());

    const accessLogStream = rfs.createStream(`logs/access.log`, {
      interval: '1d',
      compress: 'gzip',
    });

    if (AppConfig.APP_ENV == ENVIRONMENTS.LOCAL) {
      this.app.use(morgan('tiny'));
    } else {
      this.app.use(morgan('tiny', { stream: accessLogStream }));
    }
    this.app.use(
      cors({
        origin: AppConfig.APP_ALLOWED_ORIGINS,
        credentials: true,
      }),
    );

    this.app.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-store');
      next();
    });

    this.app.use(
      helmet({
        hsts: {
          maxAge: 31536000,
        },
      }),
    );

    // Amplify required the headers to be set explicitly
    this.app.use(
      cors({
        origin: AppConfig.APP_ALLOWED_ORIGINS,
        credentials: true,
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'Authentication',
          'X-Requested-With',
          'Accept',
          'Origin',
          'Cookie',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        exposedHeaders: ['Set-Cookie'],
      }),
    );
  }

  loadRoutes() {
    SetRoutes(this.app);
  }

  load() {
    this.loadMiddleware();
    this.loadRoutes();
  }
}
