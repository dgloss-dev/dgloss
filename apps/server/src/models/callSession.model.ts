import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Caller } from './caller.model';
import { CallList } from './callList.model';
import { User } from './user.model';
import { CALL_SESSION_STATUS } from '@workspace/types/enums/callSession';
import { CallStatusHistory } from './callStatusHistory.model';

@Table({
  tableName: CallSession.CALL_SESSION_TABLE_NAME,
  timestamps: true,
})
export class CallSession extends Model {
  public static CALL_SESSION_TABLE_NAME = 'call_sessions';
  public static CALL_SESSION_ID = 'id';
  public static CALL_SESSION_CALLER_ID = 'caller_id';
  public static CALL_SESSION_CALL_LIST_ID = 'call_list_id';
  public static CALL_SESSION_OPERATOR_ID = 'operator_id';
  public static CALL_SESSION_AI_INITIATED = 'ai_initiated';
  public static CALL_SESSION_START_TIME = 'start_time';
  public static CALL_SESSION_END_TIME = 'end_time';
  public static CALL_SESSION_STATUS = 'status';
  public static CALL_SESSION_AI_DECISION_PATH = 'ai_decision_path';
  public static CALL_SESSION_RECORDING_URL = 'recording_url';
  public static CALL_SESSION_MEMO = 'memo';
  public static CALL_SESSION_HANDOVER_AT = 'handover_at';
  public static CALL_SESSION_ATTEMPT_COUNT = 'attempt_count';
  public static CALL_SESSION_TRANSCRIPT_TEXT = 'transcript_text';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: CallSession.CALL_SESSION_ID,
  })
  id: number;

  @ForeignKey(() => Caller)
  @Column({
    type: DataType.INTEGER,
    field: CallSession.CALL_SESSION_CALLER_ID,
    allowNull: false,
  })
  callerId: number;

  @ForeignKey(() => CallList)
  @Column({
    type: DataType.INTEGER,
    field: CallSession.CALL_SESSION_CALL_LIST_ID,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  callListId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: CallSession.CALL_SESSION_OPERATOR_ID,
    allowNull: true,
  })
  operatorId: number;

  @Column({
    type: DataType.BOOLEAN,
    field: CallSession.CALL_SESSION_AI_INITIATED,
    allowNull: false,
    defaultValue: false,
  })
  aiInitiated: boolean;

  @Column({
    type: DataType.DATE,
    field: CallSession.CALL_SESSION_START_TIME,
    allowNull: true,
  })
  startTime: Date;

  @Column({
    type: DataType.DATE,
    field: CallSession.CALL_SESSION_END_TIME,
    allowNull: true,
  })
  endTime: Date;

  @Column({
    type: DataType.ENUM(...Object.values(CALL_SESSION_STATUS)),
    field: CallSession.CALL_SESSION_STATUS,
    allowNull: false,
  })
  status: CALL_SESSION_STATUS;

  @Column({
    type: DataType.TEXT,
    field: CallSession.CALL_SESSION_AI_DECISION_PATH,
    allowNull: true,
  })
  aiDecisionPath: string;

  @Column({
    type: DataType.STRING(500),
    field: CallSession.CALL_SESSION_RECORDING_URL,
    allowNull: true,
  })
  recordingUrl: string;

  @Column({
    type: DataType.TEXT,
    field: CallSession.CALL_SESSION_MEMO,
    allowNull: true,
  })
  memo: string;

  @Column({
    type: DataType.DATE,
    field: CallSession.CALL_SESSION_HANDOVER_AT,
    allowNull: true,
  })
  handoverAt: Date;

  @Column({
    type: DataType.INTEGER,
    field: CallSession.CALL_SESSION_ATTEMPT_COUNT,
    allowNull: false,
    defaultValue: 0,
  })
  attemptCount: number;

  @Column({
    type: DataType.TEXT,
    field: CallSession.CALL_SESSION_TRANSCRIPT_TEXT,
    allowNull: true,
  })
  transcriptText: string;

  @BelongsTo(() => Caller)
  caller: Caller;

  @BelongsTo(() => CallList)
  callList: CallList;

  @BelongsTo(() => User)
  operator: User;

  @HasMany(() => CallStatusHistory)
  statusHistory: CallStatusHistory[];
}
