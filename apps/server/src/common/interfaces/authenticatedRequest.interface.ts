import { Request } from 'express';
import { IAuthenticatedUser } from './authenticatedUser.interface';

export interface AuthenticatedRequest extends Request {
  user: IAuthenticatedUser;
}
