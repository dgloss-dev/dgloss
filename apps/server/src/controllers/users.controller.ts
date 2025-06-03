import { Request, Response } from 'express';
import { UsersService } from '../services';
import { logger } from '../utils/winston.utils';
import { cb, cbError } from '../common/handler';
import { ERRORS } from '../common/constants';
import { CreateUserDto, FilterUserDto } from '@workspace/types/dto/user';
import { HTTPSTATUS } from '@workspace/types/enums/common';

import { AuthenticatedRequest } from '../common/interfaces';

export class UserController {
  private userService: UsersService;

  constructor() {
    this.userService = UsersService.getInstance();
  }

  getAllUsers = async (req: Request, res: Response) => {
    logger.info('UserController - getAllUsers()');
    try {
      const filters: FilterUserDto = {
        start: parseInt(req?.query?.start as string, 10) || 0,
        limit: parseInt(req?.query?.limit as string, 10) || Number.MAX_SAFE_INTEGER,
        sortBy: req?.query?.sortBy as string,
        order: parseInt(req?.query?.order as string, 10) as 1 | -1,
        username: req?.query?.username as string,
        email: req?.query?.email as string,
      };

      const result = await this.userService.getAllUsers(filters);
      return cb(HTTPSTATUS.OK, res, result);
    } catch (error) {
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    logger.info('UserController - getUserById()');

    try {
      const id = parseInt(req.params?.id, 10);
      const user = await this.userService.getUserById(id);

      if (!user) {
        return cbError(res, HTTPSTATUS.NOT_FOUND, ERRORS.NOT_FOUND, null);
      }

      return cb(HTTPSTATUS.OK, res, user);
    } catch (error) {
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.GET_FAILED, error);
    }
  };

  createUser = async (req: Request, res: Response) => {
    logger.info('UserController - register()');

    try {
      const data: CreateUserDto = req.body;
      const createdUser = await this.userService.createUser(data);

      return cb(HTTPSTATUS.OK, res, createdUser);
    } catch (error: any) {
      if (error.message === ERRORS.ALREADY_EXISTS.key) {
        return cbError(res, HTTPSTATUS.CONFLICT, ERRORS.ALREADY_EXISTS, null);
      }
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.UPDATE_FAILED, error);
    }
  };

  deleteUser = async (req: AuthenticatedRequest, res: Response) => {
    logger.info('UserController - deleteUser()');
    try {
      const id = req.user.id;
      const deleted = await this.userService.deleteUser(id);

      if (deleted) {
        return cb(HTTPSTATUS.NO_CONTENT, res, {});
      }

      return cbError(res, HTTPSTATUS.NOT_FOUND, ERRORS.NOT_FOUND, null);
    } catch (error: any) {
      return cbError(res, HTTPSTATUS.INTERNAL_SERVER_ERROR, ERRORS.UPDATE_FAILED, error);
    }
  };
}
