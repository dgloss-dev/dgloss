import { CallList } from '../models';
import { logger } from '../utils/winston.utils';
import { ICallList } from '@workspace/types/interfaces/callList';

export class CallListsDao {
  private static instance: CallListsDao;

  private constructor() {}

  public static getInstance = (): CallListsDao => {
    if (!this.instance) {
      this.instance = new CallListsDao();
    }
    return this.instance;
  };

  async createCallList(data: ICallList): Promise<CallList> {
    logger.info('CallListsDao - createCallList()');

    try {
      const newCallList = await CallList.create({ ...data });
      return newCallList;
    } catch (error) {
      logger.error('[CallListsDao]: Error in creating call list');
      throw error;
    }
  }
}
