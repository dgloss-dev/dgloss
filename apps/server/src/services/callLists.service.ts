import { CallListsDao } from '../dao/callLists.dao';
import { CreateCallListDto } from '@workspace/types/dto/callList';
import { logger } from '../utils/winston.utils';
import { ICallList } from '@workspace/types/interfaces/callList';
import { ThrowError } from '../utils/error.utils';

export class CallListsService {
  public static instance: CallListsService;
  private callListsDao: CallListsDao;

  private constructor() {
    this.callListsDao = CallListsDao.getInstance();
  }

  public static getInstance = (): CallListsService => {
    if (!this.instance) {
      this.instance = new CallListsService();
    }
    return this.instance;
  };

  public async createCallList(callListData: CreateCallListDto): Promise<ICallList> {
    logger.info('CallListsService - createCallList()');

    try {
      const createdCallList = await this.callListsDao.createCallList(callListData);
      return createdCallList;
    } catch (error) {
      throw ThrowError(error);
    }
  }
}
