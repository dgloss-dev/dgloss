import { Op } from 'sequelize';
import { CreateUserDto, FilterUserDto } from '@workspace/types/dto/user';
import { USER_STATUS } from '@workspace/types/enums/user';
import { IUser } from '@workspace/types/interfaces/user';
import { User } from '../models';
import { logger } from '../utils/winston.utils';

export class UsersDao {
  public static instance: UsersDao;

  static getInstance = (): UsersDao => {
    if (!this.instance) {
      this.instance = new UsersDao();
    }
    return this.instance;
  };

  async filterUsers(filters: FilterUserDto): Promise<{ rows: User[]; count: number }> {
    logger.info('UsersDao - getAllUsers()');

    try {
      const { username, email, limit, start, sortBy = 'createdAt', order } = filters;

      const query: any = {
        status: { [Op.ne]: USER_STATUS.DELETED },
      };

      if (username) {
        query.username = { [Op.iLike]: `%${username}%` };
      }

      if (email) {
        query.email = { [Op.iLike]: `%${email}%` };
      }

      const users = await User.findAndCountAll({
        where: query,
        limit,
        offset: start,
        order: [[sortBy, order === 1 ? 'ASC' : 'DESC']],
      });
      return users;
    } catch (error) {
      logger.error('Error in retrieving User');
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    logger.info(`UsersDao - getUserById() for ID: ${id}`);

    try {
      const user = await User.findByPk(id);

      if (!user) {
        throw new Error(`User ${id} not found`);
      }
      return user;
    } catch (error) {
      logger.error(`Error fetching user ${id}`, error);
      throw error;
    }
  }

  async createUser(data: CreateUserDto): Promise<User> {
    logger.info('UsersDao - createUser()');

    try {
      const createdUser = await User.create({ ...data });
      return createdUser;
    } catch (error) {
      logger.error(`Error in creating User`);
      throw error;
    }
  }

  async updateUserById(id: number, updateData: Partial<IUser>): Promise<User> {
    logger.info('UsersDao - updateUser()');
    try {
      const sanitizedData = this.sanitizeUpdateData(updateData);
      const [count, updatedUsers] = await User.update(sanitizedData, {
        where: {
          id,
          status: { [Op.ne]: USER_STATUS.DELETED },
        },
        returning: true,
      });

      if (count === 0) {
        const error = `User ${id} not found or already deleted`;
        throw new Error(error);
      }

      const updatedUser = updatedUsers[0];
      logger.info(`User ${id} updated successfully`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error in updating User ${id}`);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    logger.info('UsersDao - deleteUser()');

    try {
      const [count] = await User.update(
        { status: USER_STATUS.DELETED },
        {
          where: {
            id: id,
            status: { [Op.ne]: USER_STATUS.DELETED },
          },
        },
      );
      return count > 0;
    } catch (error) {
      logger.error(`Error in deleting User ${id}`);
      throw error;
    }
  }

  private sanitizeUpdateData(data: Partial<IUser>): Partial<IUser> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, status, ...sanitizedData } = data;
    return sanitizedData;
  }
}
