import { CallerPhone } from '../models';
import { CreationAttributes, Transaction } from 'sequelize';
import { logger } from '../utils/winston.utils';
import { ThrowError } from '../utils/error.utils';

export class CallerPhoneDao {
  private static instance: CallerPhoneDao;

  private constructor() {}

  public static getInstance = (): CallerPhoneDao => {
    if (!this.instance) {
      this.instance = new CallerPhoneDao();
    }
    return this.instance;
  };

  async upsertPhones(phones: CreationAttributes<CallerPhone>[], transaction?: Transaction) {
    logger.info('CallerPhoneDao - upsertPhones()');
    try {
      await CallerPhone.bulkCreate(phones, {
        updateOnDuplicate: ['phoneNumber', 'updatedAt'],
        transaction,
      });
    } catch (error) {
      logger.error('[CallerPhoneDao]: Error in bulk upsert');
      throw ThrowError(error);
    }
  }
}
