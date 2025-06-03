import { UsersDao } from '../dao/users.dao';
import { CreateUserDto, FilterUserDto } from '@workspace/types/dto/user';
import { ThrowError } from '../utils/error.utils';
import { logger } from '../utils/winston.utils';
import { User } from '../models';

export class UsersService {
  public static instance: UsersService;
  private usersDao = UsersDao.getInstance();

  public static getInstance = (): UsersService => {
    if (!this.instance) {
      this.instance = new UsersService();
    }
    return this.instance;
  };

  public async getAllUsers(filters: FilterUserDto): Promise<{ rows: User[]; count: number }> {
    logger.info('UsersService - getAllUsers()');

    try {
      return await this.usersDao.filterUsers(filters);
    } catch (error) {
      throw ThrowError(error);
    }
  }

  public async getUserById(id: number): Promise<User | null> {
    logger.info('UsersService - getUserById()');
    try {
      const user = await this.usersDao.getUserById(id);
      return user;
    } catch (error) {
      throw ThrowError(error);
    }
  }

  public async createUser(data: CreateUserDto): Promise<User | null> {
    logger.info('UsersService - createUser()');

    try {
      const createdUser = await this.usersDao.createUser(data);
      return createdUser;
    } catch (error) {
      throw ThrowError(error);
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    logger.info('UsersService - deleteUser()');
    try {
      return await this.usersDao.deleteUser(userId);
    } catch (error) {
      throw ThrowError(error);
    }
  }
}
