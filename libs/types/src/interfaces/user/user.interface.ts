import { USER_STATUS } from '../../enums/user';

export interface IUser {
  id: number;
  username: string;
  email: string;
  status: USER_STATUS;
  createdAt: Date;
  updatedAt: Date;
}
