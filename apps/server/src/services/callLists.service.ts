import { CallListsDao } from '../dao/callLists.dao';
import {
  CreateCallListDto,
  FilterCallListDto,
  DeleteCallListDto,
  UpdateCallListDto,
} from '@workspace/types/dto/callList';
import { logger } from '../utils/winston.utils';
import { ICallList } from '@workspace/types/interfaces/callList';
import { ThrowError } from '../utils/error.utils';
import { Caller, CallerPhone, CallList } from '../models';
import { CreateCallerDto } from '@workspace/types/dto/caller/createCaller.dto';
import { SQLLoader } from '../loaders';
import { CallerDao } from '../dao/caller.dao';
import { CALLER_PHONE_SLOT } from '@workspace/types/enums/callerPhone';
import { CallerPhoneDao } from '../dao/callerPhone.dao';
import { CallerUtils } from '../utils/caller.utils';
import { CreationAttributes } from 'sequelize';

export class CallListsService {
  public static instance: CallListsService;
  private callListsDao: CallListsDao;
  private callerDao: CallerDao;
  private sqlLoader: SQLLoader;

  private callerPhoneDao: CallerPhoneDao;
  private callerUtils: CallerUtils;

  private constructor() {
    this.callListsDao = CallListsDao.getInstance();
    this.callerDao = CallerDao.getInstance();
    this.sqlLoader = SQLLoader.getInstance();
    this.callerPhoneDao = CallerPhoneDao.getInstance();
    this.callerUtils = CallerUtils.getInstance();
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
        records = await this.callerUtils.processCallerCsv(objectKey);
      }

      const callers = records.map((record) => {
        const { targetId, phoneNumberOne, phoneNumberTwo, phoneNumberThree, ...rest } = record;
        const phones = [];
        if (phoneNumberOne)
          phones.push({ phoneNumber: phoneNumberOne, slot: CALLER_PHONE_SLOT.FIRST });
        if (phoneNumberTwo)
          phones.push({ phoneNumber: phoneNumberTwo, slot: CALLER_PHONE_SLOT.SECOND });
        if (phoneNumberThree)
          phones.push({ phoneNumber: phoneNumberThree, slot: CALLER_PHONE_SLOT.THIRD });
        return { ...rest, phones };
      });

      const aiCallSlots = callListData.callTimeSlots?.map((slot) => ({
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
      }));

      const data: ICallList = {
        ...baseCallListData,
        callers: callers.map((record) => ({
          ...record,
          callListId: undefined,
        })),
        aiCallSlots: aiCallSlots || [],
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

  public async updateCallList(id: number, callListData: UpdateCallListDto): Promise<ICallList> {
    logger.info('CallListsService - updateCallList()');

    const sequelize = this.sqlLoader.getSequelizeInstance();
    const transaction = await sequelize.transaction();

    try {
      const { objectKey } = callListData;
      if (objectKey) {
        const records = await this.callerUtils.processCallerCsv(objectKey);

        const existingCallers = await this.callerDao.findByCallListId(id, transaction);
        const existingCallerMap = new Map(existingCallers.map((c) => [c.id.toString(), c]));

        // Prepare data for bulk update and creation of callers
        const callersToUpdate: CreationAttributes<Caller>[] = [];

        // Prepare data for bulk creation of new callers along with creation of phones
        const callersWithPhonesToCreate: CreationAttributes<Caller>[] = [];

        // Prepare data for bulk update or creation of phones using callerId and slot
        const phonesToUpdateOrCreateByCallerIdAndSlot: CreationAttributes<CallerPhone>[] = [];

        for (const record of records) {
          const targetId = record.targetId?.toString().trim();
          const { phoneNumberOne, phoneNumberTwo, phoneNumberThree, ...callerData } = record;

          // Prepare phone data
          const phones = [];
          if (phoneNumberOne)
            phones.push({ phoneNumber: phoneNumberOne, slot: CALLER_PHONE_SLOT.FIRST });
          if (phoneNumberTwo)
            phones.push({ phoneNumber: phoneNumberTwo, slot: CALLER_PHONE_SLOT.SECOND });
          if (phoneNumberThree)
            phones.push({ phoneNumber: phoneNumberThree, slot: CALLER_PHONE_SLOT.THIRD });

          // Case 1: Existing caller (valid targetId)
          if (targetId && existingCallerMap.has(targetId)) {
            const callerId = parseInt(targetId, 10);
            callersToUpdate.push({
              id: callerId,
              callListId: id,
              ...callerData,
            });

            for (const phone of phones) {
              // If phoneNumber is present,
              // update or create the phone record for the respective callerId and slot
              if (phone.phoneNumber) {
                phonesToUpdateOrCreateByCallerIdAndSlot.push({
                  phoneNumber: phone.phoneNumber,
                  slot: phone.slot,
                  callerId,
                });
              }
            }
          }
          // Case 2: New caller (no targetId)
          else if (!targetId) {
            callersWithPhonesToCreate.push({
              ...callerData,
              callListId: id,
              phones,
            });
          }
        }

        if (callersToUpdate.length > 0) {
          await this.callerDao.createOrUpdateBulk(callersToUpdate, transaction);
        }

        if (callersWithPhonesToCreate.length > 0) {
          await this.callerDao.bulkCreateWithPhones(callersWithPhonesToCreate, id, transaction);
        }

        // Update existing phones
        if (phonesToUpdateOrCreateByCallerIdAndSlot.length > 0) {
          await this.callerPhoneDao.upsertPhones(
            phonesToUpdateOrCreateByCallerIdAndSlot,
            transaction,
          );
        }
      }

      // finally update the callList
      const callList = await this.callListsDao.updateCallListById(id, callListData, transaction);

      await transaction.commit();

      return callList;
    } catch (error) {
      await transaction.rollback();
      throw ThrowError(error);
    }
  }
}
