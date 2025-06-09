import { FilterCallListDto } from '@workspace/types/dto/callList';
import { CallList } from '../models';
import { logger } from '../utils/winston.utils';
import { ICallList } from '@workspace/types/interfaces/callList';
import { Op } from 'sequelize';

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

  async filterCallLists(filter: FilterCallListDto): Promise<{
    rows: CallList[];
    count: number;
  }> {
    try {
      const { name, start = 0, limit = 20, sortBy = 'createdAt', order = -1 } = filter;

      const where: any = {
        name: { [Op.iLike]: `%${name}%` },
      };

      const callLists = await CallList.findAndCountAll({
        where,
        order: [[sortBy, order === 1 ? 'ASC' : 'DESC']],
        limit,
        offset: start,
      });

      return callLists;
    } catch (error) {
      logger.error('[CallListsDao]: Error in retrieving call lists');
      throw error;
    }
  }
}
