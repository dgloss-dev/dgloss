import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Caller } from './caller.model';

@Table({
  tableName: MyCallList.MY_CALL_LIST_TABLE_NAME,
  timestamps: true,
})
export class MyCallList extends Model {
  public static MY_CALL_LIST_TABLE_NAME = 'my_call_lists';
  public static MY_CALL_LIST_ID = 'id';
  public static MY_CALL_LIST_USER_ID = 'user_id';
  public static MY_CALL_LIST_CALLER_ID = 'caller_id';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: MyCallList.MY_CALL_LIST_ID,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: MyCallList.MY_CALL_LIST_USER_ID,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Caller)
  @Column({
    type: DataType.INTEGER,
    field: MyCallList.MY_CALL_LIST_CALLER_ID,
    allowNull: false,
  })
  callerId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Caller)
  caller: Caller;
}
