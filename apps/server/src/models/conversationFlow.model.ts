import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { VoiceData } from './voiceData.model';

@Table({
  tableName: ConversationFlow.CONVERSATION_FLOW_TABLE_NAME,
  timestamps: true,
})
export class ConversationFlow extends Model {
  public static CONVERSATION_FLOW_TABLE_NAME = 'conversation_flows';
  public static CONVERSATION_FLOW_ID = 'id';
  public static CONVERSATION_FLOW_VOICE_DATA_ID = 'voice_data_id';
  public static CONVERSATION_FLOW_NEXT_STATE_ID = 'next_state_id';
  public static CONVERSATION_FLOW_ERROR_HANDLING = 'error_handling';
  public static CONVERSATION_FLOW_END_FLAG = 'end_flag';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: ConversationFlow.CONVERSATION_FLOW_ID,
  })
  id: number;

  @ForeignKey(() => VoiceData)
  @Column({
    type: DataType.INTEGER,
    field: ConversationFlow.CONVERSATION_FLOW_VOICE_DATA_ID,
    allowNull: false,
  })
  voiceDataId: number;

  @ForeignKey(() => ConversationFlow)
  @Column({
    type: DataType.INTEGER,
    field: ConversationFlow.CONVERSATION_FLOW_NEXT_STATE_ID,
    allowNull: true,
  })
  nextStateId: number;

  @Column({
    type: DataType.TEXT,
    field: ConversationFlow.CONVERSATION_FLOW_ERROR_HANDLING,
    allowNull: true,
  })
  errorHandling: string;

  @Column({
    type: DataType.BOOLEAN,
    field: ConversationFlow.CONVERSATION_FLOW_END_FLAG,
    allowNull: false,
    defaultValue: false,
  })
  endFlag: boolean;

  @BelongsTo(() => VoiceData)
  voiceData: VoiceData;

  @HasOne(() => ConversationFlow, 'nextStateId')
  nextState: ConversationFlow;

  @BelongsTo(() => ConversationFlow, 'nextStateId')
  previousState: ConversationFlow;
}
