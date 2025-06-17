import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { VoiceData } from './voiceData.model';
import { VoiceDataGroup } from './voiceDataGroup.model';

@Table({
  tableName: VoiceDataGroupMapping.VOICE_DATA_GROUP_MAPPING_TABLE_NAME,
  timestamps: true,
})
export class VoiceDataGroupMapping extends Model {
  public static VOICE_DATA_GROUP_MAPPING_TABLE_NAME = 'voice_data_group_mappings';
  public static VOICE_DATA_GROUP_MAPPING_ID = 'id';
  public static VOICE_DATA_GROUP_MAPPING_VOICE_DATA_ID = 'voice_data_id';
  public static VOICE_DATA_GROUP_MAPPING_VOICE_DATA_GROUP_ID = 'voice_data_group_id';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: VoiceDataGroupMapping.VOICE_DATA_GROUP_MAPPING_ID,
  })
  id: number;

  @ForeignKey(() => VoiceData)
  @Column({
    type: DataType.INTEGER,
    field: VoiceDataGroupMapping.VOICE_DATA_GROUP_MAPPING_VOICE_DATA_ID,
    allowNull: false,
  })
  voiceDataId: number;

  @ForeignKey(() => VoiceDataGroup)
  @Column({
    type: DataType.INTEGER,
    field: VoiceDataGroupMapping.VOICE_DATA_GROUP_MAPPING_VOICE_DATA_GROUP_ID,
    allowNull: false,
  })
  voiceDataGroupId: number;

  @BelongsTo(() => VoiceData)
  voiceData: VoiceData;

  @BelongsTo(() => VoiceDataGroup)
  voiceDataGroup: VoiceDataGroup;
}
