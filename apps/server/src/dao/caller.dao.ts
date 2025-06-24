import { Caller } from '../models';
import { Transaction, CreationAttributes } from 'sequelize';
import { logger } from '../utils/winston.utils';
import { ThrowError } from '../utils/error.utils';

export class CallerDao {
  private static instance: CallerDao;

  private constructor() {}

  public static getInstance = (): CallerDao => {
    if (!this.instance) {
      this.instance = new CallerDao();
    }
    return this.instance;
  };

  async findByCallListId(callListId: number, transaction?: Transaction) {
    logger.info('CallerDao - findByCallListId()');
    try {
      const callers = await Caller.findAll({ where: { callListId }, transaction });
      return callers;
    } catch (error) {
      logger.error('[CallerDao]: error in finding callers by call list id');
      throw ThrowError(error);
    }
  }

  async bulkCreateWithPhones(
    callers: CreationAttributes<Caller>[],
    callListId: number,
    transaction?: Transaction,
  ) {
    logger.info('CallerDao - bulkCreateWithPhones()');
    try {
      return await Caller.bulkCreate(callers, {
        include: [{ association: 'phones' }],
        transaction,
      });
    } catch (error) {
      logger.error('[CallerDao]: Error in bulk creating callers with phones');
      throw ThrowError(error);
    }
  }

  async createOrUpdateBulk(callers: CreationAttributes<Caller>[], transaction?: Transaction) {
    logger.info('CallerDao - createOrUpdateBulk()');
    try {
      return await Caller.bulkCreate(callers, {
        updateOnDuplicate: [
          'name',
          'ordinalNum',
          'industryType',
          'employee',
          'annualTradingSession',
          'personInCharge',
          'callPermission',
          'url',
          'memo',
        ],
        transaction,
      });
    } catch (error) {
      logger.error('[CallerDao]: Error in bulk createOrUpdate callers');
      throw ThrowError(error);
    }
  }
}
