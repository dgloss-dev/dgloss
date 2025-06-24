import { FilterCallListDto } from '@workspace/types/dto/callList';
import { AiCallSlot, Caller, CallerPhone, CallList } from '../models';
import { logger } from '../utils/winston.utils';
import { ICallList } from '@workspace/types/interfaces/callList';
import { Op, Transaction, literal } from 'sequelize';
import { ERRORS } from '../common/constants';

export class CallListsDao {
  private static instance: CallListsDao;

  private constructor() {}

  public static getInstance = (): CallListsDao => {
    if (!this.instance) {
      this.instance = new CallListsDao();
    }
    return this.instance;
  };

  async createCallList(data: ICallList, transaction?: Transaction): Promise<CallList> {
    logger.info('CallListsDao - createCallList()');

    try {
      const newCallList = await CallList.create(
        { ...data },
        {
          include: [
            {
              model: Caller,
              as: 'callers',
              include: [
                {
                  model: CallerPhone,
                  as: 'phones',
                },
              ],
            },
            {
              model: AiCallSlot,
              as: 'aiCallSlots',
            },
          ],
          transaction,
        },
      );
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
        include: [
          {
            association: 'callers',
            required: false,
          },
        ],
        attributes: {
          include: [
            [
              literal(`(
                SELECT COUNT(*)
                FROM callers
                WHERE callers.call_list_id = "CallList".id
              )`),
              'callersCount',
            ],
          ],
        },
        distinct: true,
      });

      return callLists;
    } catch (error) {
      logger.error('[CallListsDao]: Error in retrieving call lists');
      throw error;
    }
  }

  async bulkDeleteCallLists(ids: number[], transaction?: Transaction): Promise<number> {
    logger.info('CallListsDao - bulkDeleteCallLists()');

    try {
      const deletedCount = await CallList.destroy({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
        transaction,
      });
      return deletedCount;
    } catch (error) {
      logger.error('[CallListsDao]: Error in bulk deleting call lists');
      throw error;
    }
  }

  async updateCallListById(
    id: number,
    data: Partial<ICallList>,
    transaction?: Transaction,
  ): Promise<CallList> {
    logger.info('CallListsDao - updateCallListById()');
    try {
      const [updatedCount, [updatedCallList]] = await CallList.update(data, {
        where: { id },
        returning: true,
        transaction,
      });

      if (updatedCount === 0) {
        logger.error(`Call list for ${id} if not found`);
        throw new Error(ERRORS.CALL_LIST_NOT_FOUND.key);
      }

      logger.info(`Call list ${id} updated successfully`);
      return updatedCallList;
    } catch (error) {
      logger.error('[CallListsDao]: Error in updating call list');
      throw error;
    }
  }
}
