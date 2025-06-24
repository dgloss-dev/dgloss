import Ajv from 'ajv';
import { parse } from 'csv-parse/sync';
import {
  CreateCallerDto,
  createCallerDtoSchema,
} from '@workspace/types/dto/caller/createCaller.dto';
import { UtilsService } from '../services/utils.service';
import { AppConfig } from '../config';
import ajvFormats from 'ajv-formats';

export class CallerUtils {
  private static instance: CallerUtils;
  private utilsService: UtilsService;
  private ajv: Ajv;

  private constructor() {
    this.utilsService = UtilsService.getInstance();
    this.ajv = new Ajv();
    ajvFormats(this.ajv);
  }

  public static getInstance = (): CallerUtils => {
    if (!this.instance) {
      this.instance = new CallerUtils();
    }
    return this.instance;
  };

  public async processCallerCsv(objectKey: string): Promise<CreateCallerDto[]> {
    const s3CsvData = await this.utilsService.getStreamFromS3(objectKey, AppConfig.PROJECT_BUCKET);

    const csvData = s3CsvData.toString('utf-8');
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const filteredRecords = records.filter((record) =>
      Object.values(record).some((value) => typeof value === 'string' && value.trim() !== ''),
    );

    const validationErrors: string[] = [];
    filteredRecords.forEach((record: any, index: number) => {
      const validation = this.validateCallerRecord(createCallerDtoSchema, record);
      if (!validation.isValid) {
        validationErrors.push(`Record ${index + 2}: ${validation.errors}`);
      }
    });

    if (validationErrors.length > 0) {
      throw new Error(`Invalid caller records found:\n${validationErrors.join('\n')}`);
    }

    return filteredRecords;
  }

  public validateCallerRecord(schema: any, record: any) {
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
