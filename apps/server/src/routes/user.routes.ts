import { Router } from 'express';
import { UserController } from '../controllers/users.controller';
import { ValidateQueryParams, ValidateRequest, Authenticate } from '../common/middleware';
import { createUserDtoSchema, filterUserDtoSchema } from '@workspace/types/dto/user';

export default class UsersRoutes {
  private usersController: UserController;
  public router: Router;

  constructor() {
    this.router = Router();
    this.usersController = new UserController();
    this.configureRoutes();
  }

  private configureRoutes() {
    // GET /users
    this.router.get(
      `/`,
      Authenticate(),
      ValidateQueryParams(filterUserDtoSchema),
      this.usersController.getAllUsers,
    );

    // POST /users
    this.router.post(`/`, ValidateRequest(createUserDtoSchema), this.usersController.createUser);

    // GET /users/:id
    this.router.get(`/:id`, this.usersController.getUserById);

    // DELETE /users
    this.router.delete(`/`, Authenticate(), this.usersController.deleteUser);
  }
}
