import { USER_STATUS } from '@workspace/types/enums/user';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: User.USER_TABLE_NAME,
  timestamps: false,
})
export class User extends Model {
  public static USER_TABLE_NAME = 'users';
  public static USER_ID = 'id';
  public static USER_NAME = 'username';
  public static USER_EMAIL = 'email';
  public static USER_STATUS = 'status';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: User.USER_ID,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
    field: User.USER_NAME,
  })
  username: string;

  @Column({
    type: DataType.STRING(100),
    field: User.USER_EMAIL,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM(...Object.values(USER_STATUS)),
    field: User.USER_STATUS,
    defaultValue: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS;
}
