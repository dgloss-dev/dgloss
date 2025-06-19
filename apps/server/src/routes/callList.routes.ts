import { Router } from 'express';
import { CallListsController } from '../controllers/callLists.controller';
import { ValidateQueryParams, ValidateRequest } from '../common/middleware';
import { createCallListDtoSchema, filterCallListDtoSchema } from '@workspace/types/dto/callList';

export default class CallListRoutes {
  private callListsController: CallListsController;
  public router: Router;

  constructor() {
    this.router = Router();
    this.callListsController = new CallListsController();
    this.configureRoutes();
  }

  configureRoutes() {
    this.router.post(
      '/',
      ValidateRequest(createCallListDtoSchema),
      this.callListsController.createCallList,
    );

    this.router.get(
      '/',
      ValidateQueryParams(filterCallListDtoSchema),
      this.callListsController.getAllCallLists,
    );

    this.router.get('/:id/details', this.callListsController.getCallListDetails);
  }
}
