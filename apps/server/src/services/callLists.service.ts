import { CallListsDao } from '../dao/callLists.dao';
import { CreateCallListDto, FilterCallListDto } from '@workspace/types/dto/callList';
import { logger } from '../utils/winston.utils';
import { ICallList } from '@workspace/types/interfaces/callList';
import { ThrowError } from '../utils/error.utils';
import { CallList } from '../models';

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

  public async getCallListDetails(id: number): Promise<CallList | null> {
    logger.info('CallListsService - getCallListDetails()');
    try {
      const callListDetails = await this.callListsDao.getCallListDetails(id);
      return callListDetails;
    } catch (error) {
      throw ThrowError(error);
    }
  }
}
