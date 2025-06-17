import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Label } from './label.model';
import { VoiceDataLabel } from './voiceDataLabel.model';
import { VoiceDataGroup } from './voiceDataGroup.model';
import { VoiceDataGroupMapping } from './voiceDataGroupMapping.model';
import { ConversationFlow } from './conversationFlow.model';

@Table({
  tableName: VoiceData.VOICE_DATA_TABLE_NAME,
  timestamps: true,
})
export class VoiceData extends Model {
  public static VOICE_DATA_TABLE_NAME = 'voice_data';
  public static VOICE_DATA_ID = 'id';
  public static VOICE_DATA_AUDIO_URL = 'audio_url';
  public static VOICE_DATA_TRANSCRIPT = 'transcript';
  public static VOICE_DATA_CREATED_BY = 'created_by';
  public static VOICE_DATA_DURATION = 'duration';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: VoiceData.VOICE_DATA_ID,
  })
  id: number;

  @Column({
    type: DataType.STRING(500),
    field: VoiceData.VOICE_DATA_AUDIO_URL,
    allowNull: false,
  })
  audioUrl: string;

  @Column({
    type: DataType.TEXT,
    field: VoiceData.VOICE_DATA_TRANSCRIPT,
    allowNull: true,
  })
  transcript: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: VoiceData.VOICE_DATA_CREATED_BY,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  createdBy: number;

  @Column({
    type: DataType.FLOAT,
    field: VoiceData.VOICE_DATA_DURATION,
    allowNull: true,
  })
  duration: number;

  @BelongsTo(() => User)
  creator: User;

  @BelongsToMany(() => Label, () => VoiceDataLabel)
  labels: Label[];

  @BelongsToMany(() => VoiceDataGroup, () => VoiceDataGroupMapping)
  voiceDataGroups: VoiceDataGroup[];

  @HasMany(() => ConversationFlow)
  conversationFlows: ConversationFlow[];
}
