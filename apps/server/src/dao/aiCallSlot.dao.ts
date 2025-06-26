import { AiCallSlot } from '../models';
import { CreationAttributes, Transaction } from 'sequelize';
import { logger } from '../utils/winston.utils';
import { ThrowError } from '../utils/error.utils';

export class AiCallSlotDao {
  private static instance: AiCallSlotDao;

  private constructor() {}

  public static getInstance = (): AiCallSlotDao => {
    if (!this.instance) {
      this.instance = new AiCallSlotDao();
    }
    return this.instance;
  };

  async upsertAiCallSlots(slots: CreationAttributes<AiCallSlot>[], transaction?: Transaction) {
    logger.info('AiCallSlotDao - upsertAiCallSlots()');
    try {
      await AiCallSlot.bulkCreate(slots, {
        updateOnDuplicate: ['startTime', 'endTime'],
        transaction,
      });
    } catch (error) {
      logger.error('[AiCallSlotDao]: Error in bulk upsert');
      throw ThrowError(error);
    }
  }
}
