import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { CallSession } from './callSession.model';
import { OPERATOR_STATE } from '@workspace/types/enums/operatorStatus/opratorState';

@Table({
  tableName: OperatorStatus.OPERATOR_STATUS_TABLE_NAME,
  timestamps: true,
  updatedAt: true,
  createdAt: false,
})
export class OperatorStatus extends Model {
  public static OPERATOR_STATUS_TABLE_NAME = 'operator_status';
  public static OPERATOR_STATUS_ID = 'id';
  public static OPERATOR_STATUS_OPERATOR_ID = 'operator_id';
  public static OPERATOR_STATUS_CURRENT_STATE = 'current_state';
  public static OPERATOR_STATUS_CALL_SESSION_ID = 'call_session_id';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: OperatorStatus.OPERATOR_STATUS_ID,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: OperatorStatus.OPERATOR_STATUS_OPERATOR_ID,
    allowNull: false,
  })
  operatorId: number;

  @Column({
    type: DataType.ENUM(...Object.values(OPERATOR_STATE)),
    field: OperatorStatus.OPERATOR_STATUS_CURRENT_STATE,
    allowNull: false,
  })
  currentState: OPERATOR_STATE;

  @ForeignKey(() => CallSession)
  @Column({
    type: DataType.INTEGER,
    field: OperatorStatus.OPERATOR_STATUS_CALL_SESSION_ID,
    allowNull: false,
  })
  callSessionId: number;

  @BelongsTo(() => User, 'operatorId')
  operator: User;

  @BelongsTo(() => CallSession)
  callSession: CallSession;
}
