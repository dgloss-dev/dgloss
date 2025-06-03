import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SetRoutes } from '../routes/routes';
import passport from 'passport';
import { AppConfig } from '../config';
import { ENVIRONMENTS } from '../common/constants';
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';

export class ExpressLoader {
  constructor(private app: Application) {
    this.app = app;
  }

  loadMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

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
    this.app.use(passport.initialize());
  }

  loadRoutes() {
    SetRoutes(this.app);
  }

  load() {
    this.loadMiddleware();
    this.loadRoutes();
  }
}
