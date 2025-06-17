import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';

import { AiCallSlot } from './aiCallSlot.model';
import { Caller } from './caller.model';
import { CallSession } from './callSession.model';
import { User } from './user.model';
import { VoiceDataGroup } from './voiceDataGroup.model';

import { CALL_STATUS } from '@workspace/types/enums/callList';

@Table({
  tableName: CallList.CALLER_LIST_TABLE_NAME,
  timestamps: true,
})
export class CallList extends Model {
  public static CALLER_LIST_TABLE_NAME = 'call_lists';
  public static CALLER_LIST_ID = 'id';
  public static CALLER_LIST_NAME = 'name';
  public static CALLER_LIST_CREATED_BY = 'created_by';
  public static CALLER_LIST_CALL_STATUS = 'call_status';
  public static CALLER_LIST_VOICE_DATA_GROUP_ID = 'voice_data_group_id';
  public static CALLER_LIST_NO_AI = 'no_ai';
  public static CALLER_LIST_TEL_NUM = 'tel_num';
  public static CALLER_LIST_AI_STATE = 'ai_state';
  public static CALLER_LIST_IS_CALL_POSSIBLE = 'is_call_possible';
  public static CALLER_LIST_DESCRIPTION = 'description';
  public static CALLER_LIST_REMARKS = 'remarks';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: CallList.CALLER_LIST_ID,
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    field: CallList.CALLER_LIST_NAME,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: CallList.CALLER_LIST_CREATED_BY,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  createdBy: number;

  @Column({
    type: DataType.ENUM(...Object.values(CALL_STATUS)),
    field: CallList.CALLER_LIST_CALL_STATUS,
    allowNull: false,
  })
  callStatus: CALL_STATUS;

  @ForeignKey(() => VoiceDataGroup)
  @Column({
    type: DataType.INTEGER,
    field: CallList.CALLER_LIST_VOICE_DATA_GROUP_ID,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  voiceDataGroupId: number;

  @Column({
    type: DataType.INTEGER,
    field: CallList.CALLER_LIST_NO_AI,
    allowNull: true,
  })
  noAi: number;

  @Column({
    type: DataType.STRING(50),
    field: CallList.CALLER_LIST_TEL_NUM,
    allowNull: true,
  })
  telNum: string;

  @Column({
    type: DataType.BOOLEAN,
    field: CallList.CALLER_LIST_AI_STATE,
    allowNull: false,
    defaultValue: false,
  })
  aiState: boolean;

  @Column({
    type: DataType.BOOLEAN,
    field: CallList.CALLER_LIST_IS_CALL_POSSIBLE,
    allowNull: false,
    defaultValue: true,
  })
  isCallPossible: boolean;

  @Column({
    type: DataType.TEXT,
    field: CallList.CALLER_LIST_DESCRIPTION,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    field: CallList.CALLER_LIST_REMARKS,
    allowNull: true,
  })
  remarks: string;

  @BelongsTo(() => User)
  createdByUser: User;

  @BelongsTo(() => VoiceDataGroup)
  voiceDataGroup: VoiceDataGroup;

  @HasMany(() => Caller)
  callers: Caller[];

  @HasMany(() => CallSession)
  callSessions: CallSession[];

  @HasMany(() => AiCallSlot)
  aiCallSlots: AiCallSlot[];
}
