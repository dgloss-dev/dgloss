import { Router } from 'express';
import { CallListsController } from '../controllers/callLists.controller';
import { ValidateQueryParams, ValidateRequest, Authenticate } from '../common/middleware';
import {
  createCallListDtoSchema,
  filterCallListDtoSchema,
  deleteCallListDtoSchema,
  updateCallListDtoSchema,
} from '@workspace/types/dto/callList';

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

    this.router.get('/:id/details', Authenticate(), this.callListsController.getCallListDetails);

    this.router.delete(
      '/',
      ValidateRequest(deleteCallListDtoSchema),
      this.callListsController.bulkDeleteCallLists,
    );

    // PATCH /call-lists - Update call list
    this.router.patch(
      '/:id',
      ValidateRequest(updateCallListDtoSchema),
      this.callListsController.updateCallList,
    );
  }
}
