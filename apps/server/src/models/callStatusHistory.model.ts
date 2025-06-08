import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { CallSession } from './callSession.model';

@Table({
  tableName: CallStatusHistory.CALL_STATUS_HISTORY_TABLE_NAME,
  timestamps: false,
})
export class CallStatusHistory extends Model {
  public static CALL_STATUS_HISTORY_TABLE_NAME = 'call_status_history';
  public static CALL_STATUS_HISTORY_ID = 'id';
  public static CALL_STATUS_HISTORY_OPERATOR_ID = 'operator_id';
  public static CALL_STATUS_HISTORY_CALL_SESSION_ID = 'call_session_id';
  public static CALL_STATUS_HISTORY_CHANGED_AT = 'changed_at';
  public static CALL_STATUS_HISTORY_CHANGED_BY = 'changed_by';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: CallStatusHistory.CALL_STATUS_HISTORY_ID,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: CallStatusHistory.CALL_STATUS_HISTORY_OPERATOR_ID,
    allowNull: false,
  })
  operatorId: number;

  @ForeignKey(() => CallSession)
  @Column({
    type: DataType.INTEGER,
    field: CallStatusHistory.CALL_STATUS_HISTORY_CALL_SESSION_ID,
    allowNull: false,
  })
  callSessionId: number;

  @Column({
    type: DataType.DATE,
    field: CallStatusHistory.CALL_STATUS_HISTORY_CHANGED_AT,
    allowNull: false,
  })
  changedAt: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: CallStatusHistory.CALL_STATUS_HISTORY_CHANGED_BY,
    allowNull: false,
  })
  changedBy: number;

  @BelongsTo(() => User, 'operatorId')
  operator: User;

  @BelongsTo(() => User, 'changedBy')
  changedByUser: User;

  @BelongsTo(() => CallSession)
  callSession: CallSession;
}
