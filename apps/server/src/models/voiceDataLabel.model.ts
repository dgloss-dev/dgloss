import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { VoiceData } from './voiceData.model';
import { Label } from './label.model';

@Table({
  tableName: VoiceDataLabel.VOICE_DATA_LABEL_TABLE_NAME,
  timestamps: true,
})
export class VoiceDataLabel extends Model {
  public static VOICE_DATA_LABEL_TABLE_NAME = 'voice_data_labels';
  public static VOICE_DATA_LABEL_ID = 'id';
  public static VOICE_DATA_LABEL_VOICE_DATA_ID = 'voice_data_id';
  public static VOICE_DATA_LABEL_LABEL_ID = 'label_id';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: VoiceDataLabel.VOICE_DATA_LABEL_ID,
  })
  id: number;

  @ForeignKey(() => VoiceData)
  @Column({
    type: DataType.INTEGER,
    field: VoiceDataLabel.VOICE_DATA_LABEL_VOICE_DATA_ID,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  voiceDataId: number;

  @ForeignKey(() => Label)
  @Column({
    type: DataType.INTEGER,
    field: VoiceDataLabel.VOICE_DATA_LABEL_LABEL_ID,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  labelId: number;

  @BelongsTo(() => VoiceData)
  voiceData: VoiceData;

  @BelongsTo(() => Label)
  label: Label;
}
