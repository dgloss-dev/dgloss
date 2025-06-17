import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { CallList } from './callList.model';
import { VoiceData } from './voiceData.model';
import { VoiceDataGroupMapping } from './voiceDataGroupMapping.model';

@Table({
  tableName: VoiceDataGroup.VOICE_DATA_GROUP_TABLE_NAME,
  timestamps: true,
})
export class VoiceDataGroup extends Model {
  public static VOICE_DATA_GROUP_TABLE_NAME = 'voice_data_groups';
  public static VOICE_DATA_GROUP_ID = 'id';
  public static VOICE_DATA_GROUP_NAME = 'name';
  public static VOICE_DATA_GROUP_DESCRIPTION = 'description';
  public static VOICE_DATA_GROUP_CREATED_BY = 'created_by';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: VoiceDataGroup.VOICE_DATA_GROUP_ID,
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    field: VoiceDataGroup.VOICE_DATA_GROUP_NAME,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    field: VoiceDataGroup.VOICE_DATA_GROUP_DESCRIPTION,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: VoiceDataGroup.VOICE_DATA_GROUP_CREATED_BY,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  createdBy: number;

  @BelongsTo(() => User)
  createdByUser: User;

  @HasMany(() => CallList)
  callLists: CallList[];

  @BelongsToMany(() => VoiceData, () => VoiceDataGroupMapping)
  voiceData: VoiceData[];
}
