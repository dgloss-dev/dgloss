import { CallListsDao } from '../dao/callLists.dao';
import {
  CreateCallListDto,
  FilterCallListDto,
  DeleteCallListDto,
} from '@workspace/types/dto/callList';
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
      const s3CsvData = await this.utilsService.getStreamFromS3(
        objectKey,
        AppConfig.PROJECT_BUCKET,
      );

      const csvData = s3CsvData.toString('utf-8');
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      // Validate each record
      const validationErrors: string[] = [];
      records.forEach((record: any, index: number) => {
        const validation = this.validateCallerRecord(createCallerDtoSchema, record);
        if (!validation.isValid) {
          validationErrors.push(`Record ${index + 1}: ${validation.errors}`);
        }
      });

      if (validationErrors.length > 0) {
        throw new Error(`Invalid caller records found:\n${validationErrors.join('\n')}`);
      }

      const data: ICallList = {
        ...baseCallListData,
        callers: records.map((record: CreateCallerDto) => ({
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

  public async bulkDeleteCallLists(data: DeleteCallListDto): Promise<number> {
    logger.info('CallListsService - bulkDeleteCallLists()');

    const sequelize = this.sqlLoader.getSequelizeInstance();
    const transaction = await sequelize.transaction();

    try {
      const deletedCount = await this.callListsDao.bulkDeleteCallLists(data.ids, transaction);
      await transaction.commit();
      return deletedCount;
    } catch (error) {
      await transaction.rollback();
      throw ThrowError(error);
    }
  }

  private validateCallerRecord(schema: any, record: any): { isValid: boolean; errors?: string } {
    for (const [key, value] of Object.entries(record)) {
      if (schema.properties[key]) {
        if (value === '') {
          record[key] = undefined;
        } else if (schema.properties[key].type === 'number') {
          record[key] = value ? Number(value) : undefined;
        } else if (schema.properties[key].type === 'boolean') {
          const lowerValue = typeof value === 'string' ? value.toLowerCase() : value;
          record[key] = lowerValue === 'true' ? true : lowerValue === 'false' ? false : undefined;
        } else {
          record[key] = value || undefined;
        }
      }
    }

    const isValid = this.ajv.validate(schema, record);

    if (!isValid) {
      return {
        isValid: false,
        errors: this.ajv.errorsText(this.ajv.errors, { separator: '\n' }),
      };
    }

    return { isValid: true };
  }
}
