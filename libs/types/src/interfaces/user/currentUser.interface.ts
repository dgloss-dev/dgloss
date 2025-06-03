import { IUser } from './user.interface';

export interface ICurrentUser extends IUser {
  roles?: number[];
}
