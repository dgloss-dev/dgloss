import { Model, Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { VoiceData } from './voiceData.model';
import { VoiceDataLabel } from './voiceDataLabel.model';

@Table({
  tableName: Label.LABEL_TABLE_NAME,
  timestamps: true,
})
export class Label extends Model {
  public static LABEL_TABLE_NAME = 'labels';
  public static LABEL_ID = 'id';
  public static LABEL_TEXT = 'text';
  public static LABEL_INTENT = 'intent';
  public static LABEL_CATEGORY = 'category';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: Label.LABEL_ID,
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    field: Label.LABEL_TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.STRING(255),
    field: Label.LABEL_INTENT,
    allowNull: false,
  })
  intent: string;

  @Column({
    type: DataType.STRING(255),
    field: Label.LABEL_CATEGORY,
    allowNull: false,
  })
  category: string;

  @BelongsToMany(() => VoiceData, () => VoiceDataLabel)
  voiceData: VoiceData[];
}
