import { CallListsDao } from '../dao/callLists.dao';
import { CreateCallListDto, FilterCallListDto } from '@workspace/types/dto/callList';
import { logger } from '../utils/winston.utils';
import { ICallList } from '@workspace/types/interfaces/callList';
import { ThrowError } from '../utils/error.utils';
import { CallList } from '../models';
import { UtilsService } from './utils.service';
import { AppConfig } from '../config';
import { parse } from 'csv-parse/sync';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import {
  CreateCallerDto,
  createCallerDtoSchema,
} from '@workspace/types/dto/caller/createCaller.dto';
import { SQLLoader } from '../loaders';
import { validateCallerRecord } from '../utils/caller.utils';

export class CallListsService {
  public static instance: CallListsService;
  private callListsDao: CallListsDao;
  private sqlLoader: SQLLoader;
  private utilsService: UtilsService;
  private ajv: Ajv;

  private constructor() {
    this.callListsDao = CallListsDao.getInstance();
    this.utilsService = UtilsService.getInstance();
    this.sqlLoader = SQLLoader.getInstance();
    this.ajv = new Ajv();
    ajvFormats(this.ajv);
  }

  public static getInstance = (): CallListsService => {
    if (!this.instance) {
      this.instance = new CallListsService();
    }
    return this.instance;
  };

  public async createCallList(callListData: CreateCallListDto): Promise<ICallList> {
    logger.info('CallListsService - createCallList()');

    const sequelize = this.sqlLoader.getSequelizeInstance();
    const transaction = await sequelize.transaction();

    try {
      const { objectKey, ...baseCallListData } = callListData;
      let records: CreateCallerDto[] = [];

      if (objectKey) {
        const s3CsvData = await this.utilsService.getStreamFromS3(
          objectKey,
          AppConfig.PROJECT_BUCKET,
        );

        const csvData = s3CsvData.toString('utf-8');
        records = parse(csvData, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });

        const validationErrors: string[] = [];
        records.forEach((record: any, index: number) => {
          const validation = validateCallerRecord(createCallerDtoSchema, record, this.ajv);
          if (!validation.isValid) {
            validationErrors.push(`Record ${index + 1}: ${validation.errors}`);
          }
        });

        if (validationErrors.length > 0) {
          throw new Error(`Invalid caller records found:\n${validationErrors.join('\n')}`);
        }
      }

      const callers = records.map((record) => {
        const { targetId, phoneNumberOne, phoneNumberTwo, phoneNumberThree, ...rest } = record;
        const phones = [];
        if (phoneNumberOne) phones.push({ phoneNumber: phoneNumberOne });
        if (phoneNumberTwo) phones.push({ phoneNumber: phoneNumberTwo });
        if (phoneNumberThree) phones.push({ phoneNumber: phoneNumberThree });
        return { ...rest, phones };
      });

      const data: ICallList = {
        ...baseCallListData,
        callers: callers.map((record) => ({
          ...record,
          callListId: undefined,
        })),
      };

      const createdCallList = await this.callListsDao.createCallList(data, transaction);
      await transaction.commit();

      return createdCallList as ICallList;
    } catch (error) {
      await transaction.rollback();
      throw ThrowError(error);
    }
  }

  public async getAllCallLists(
    filters: FilterCallListDto,
  ): Promise<{ rows: CallList[]; count: number }> {
    logger.info('CallListsService - getAllCallLists()');

    try {
      const callLists = await this.callListsDao.filterCallLists(filters);
      return callLists;
    } catch (error) {
      throw ThrowError(error);
    }
  }
}
