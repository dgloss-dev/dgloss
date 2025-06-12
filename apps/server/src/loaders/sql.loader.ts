import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';

import { User } from '../models';
import DBConfig from '../config/sql.config';
import { logger } from '../utils/winston.utils';

export class SQLLoader {
  private static instance: SQLLoader | null = null;
  private sequelize: Sequelize | null = null;

  private DB_NAME = DBConfig.DB_NAME;
  private DB_HOST = DBConfig.DB_HOST;
  private DB_PORT = DBConfig.DB_PORT;
  private DB_USER = DBConfig.DB_USER;
  private DB_PASSWORD = DBConfig.DB_PASSWORD;
  private DB_REPLICA_HOST = DBConfig.DB_REPLICA_HOST;

  private constructor() {
    this.connectToSQL();
  }

  public static getInstance(): SQLLoader {
    if (!SQLLoader.instance) {
      SQLLoader.instance = new SQLLoader();
    }

    return SQLLoader.instance;
  }

  private getRDSCertificate() {
    const certificateName = 'ap-northeast-1-bundle.pem';

    const certificatePath = path.join(__dirname, '..', 'certificates', certificateName);

    if (!existsSync(certificatePath)) {
      throw new Error(`Certificate not found at path: ${certificatePath}`);
    }

    const rdsCertificate = readFileSync(certificatePath, 'utf8');
    return rdsCertificate.toString();
  }

  private async connectToSQL() {
    this.sequelize = new Sequelize({
      database: this.DB_NAME,
      username: this.DB_USER,
      password: this.DB_PASSWORD,
      host: this.DB_HOST,
      port: this.DB_PORT,
      dialect: 'postgres',
      logQueryParameters: false,
      logging: false,
      models: [User],
      dialectOptions: {
        connectTimeout: 30000,

        // Explicit permissions were required for a successful connection between
        // The app runner instance and RDS
        ssl: {
          require: true,
          rejectUnauthorized: true,
          ca: this.getRDSCertificate(),
        },
      },
      replication: {
        read: [
          {
            host: this.DB_REPLICA_HOST,
            port: this.DB_PORT,
            username: this.DB_USER,
            password: this.DB_PASSWORD,
          },
        ],
        write: {
          host: this.DB_HOST,
          port: this.DB_PORT,
          username: this.DB_USER,
          password: this.DB_PASSWORD,
        },
      },
      pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000, // Release connection if idle for 5s
        evict: 4000, // Clean up stale connections every 4s
      },
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        logger.info('✅ SQL Connection has been established successfully.');
      })
      .catch((err) => {
        logger.error('❌ Unable to connect to the SQL database:', err);
      });
  }

  public getSequelizeInstance(): Sequelize | null {
    return this.sequelize;
  }
}
