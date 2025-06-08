import { Sequelize } from 'sequelize-typescript';
import DBConfig from '../config/sql.config';
import {
  User,
  Label,
  MyCallList,
  Settings,
  AiCallSlot,
  Caller,
  CallList,
  CallerPhone,
  CallSchedule,
  CallSession,
  CallStatusHistory,
  ConversationFlow,
  OperatorStatus,
  VoiceData,
  VoiceDataGroup,
  VoiceDataGroupMapping,
  VoiceDataLabel,
} from '../models';
import { logger } from '../utils/winston.utils';
import { AppConfig } from '../config';

export class SQLLoader {
  private static instance: SQLLoader | null = null;
  private sequelize: Sequelize | null = null;

  private DB_NAME = DBConfig.DB_NAME;
  private DB_HOST = DBConfig.DB_HOST;
  private DB_PORT = DBConfig.DB_PORT;
  private DB_USER = DBConfig.DB_USER;
  private DB_PASSWORD = DBConfig.DB_PASSWORD;

  private constructor() {
    this.connectToSQL();
  }

  public static getInstance(): SQLLoader {
    if (!SQLLoader.instance) {
      SQLLoader.instance = new SQLLoader();
    }

    return SQLLoader.instance;
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
      models: [
        User,
        Label,
        MyCallList,
        Settings,
        AiCallSlot,
        Caller,
        CallList,
        CallerPhone,
        CallSchedule,
        CallSession,
        CallStatusHistory,
        ConversationFlow,
        OperatorStatus,
        VoiceData,
        VoiceDataGroup,
        VoiceDataGroupMapping,
        VoiceDataLabel,
      ],
      dialectOptions: {
        connectTimeout: 30000,
      },
    });

    await this.sequelize
      .authenticate()
      .then(async () => {
        logger.info('✅ SQL Connection has been established successfully.');
        if (AppConfig.APP_ENV === 'local' || AppConfig.APP_ENV === 'dev') await this.syncDatabase();
      })
      .catch((err) => {
        logger.error('❌ Unable to connect to the SQL database:', err);
      });
  }

  private async syncDatabase() {
    if (!this.sequelize) return;

    try {
      await this.sequelize.sync({ alter: true, force: false });
      logger.info('✅ Database tables have been synchronized with models.');
    } catch (error) {
      logger.error('❌ Error synchronizing database tables:', error);
    }
  }

  public getSequelizeInstance(): Sequelize | null {
    return this.sequelize;
  }
}
