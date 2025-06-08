import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Caller } from './caller.model';

@Table({
  tableName: CallSchedule.CALL_SCHEDULE_TABLE_NAME,
  timestamps: true,
})
export class CallSchedule extends Model {
  public static CALL_SCHEDULE_TABLE_NAME = 'call_schedules';
  public static CALL_SCHEDULE_ID = 'id';
  public static CALL_SCHEDULE_CALLER_ID = 'caller_id';
  public static CALL_SCHEDULE_SCHEDULE_TIME = 'schedule_time';
  public static CALL_SCHEDULE_OPERATOR_ID = 'operator_id';
  public static CALL_SCHEDULE_REMARKS = 'remarks';
  public static CALL_SCHEDULE_FURIGANA = 'furigana';
  public static CALL_SCHEDULE_MEMO = 'memo';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: CallSchedule.CALL_SCHEDULE_ID,
  })
  id: number;

  @ForeignKey(() => Caller)
  @Column({
    type: DataType.INTEGER,
    field: CallSchedule.CALL_SCHEDULE_CALLER_ID,
    allowNull: false,
  })
  callerId: number;

  @Column({
    type: DataType.DATE,
    field: CallSchedule.CALL_SCHEDULE_SCHEDULE_TIME,
    allowNull: false,
  })
  scheduleTime: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: CallSchedule.CALL_SCHEDULE_OPERATOR_ID,
    allowNull: false,
  })
  operatorId: number;

  @Column({
    type: DataType.TEXT,
    field: CallSchedule.CALL_SCHEDULE_REMARKS,
    allowNull: true,
  })
  remarks: string;

  @Column({
    type: DataType.TEXT,
    field: CallSchedule.CALL_SCHEDULE_FURIGANA,
    allowNull: true,
  })
  furigana: string;

  @Column({
    type: DataType.TEXT,
    field: CallSchedule.CALL_SCHEDULE_MEMO,
    allowNull: true,
  })
  memo: string;

  @BelongsTo(() => Caller)
  caller: Caller;

  @BelongsTo(() => User, 'operatorId')
  operator: User;
}
