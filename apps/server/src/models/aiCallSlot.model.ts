import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { CallList } from './callList.model';

@Table({
  tableName: AiCallSlot.AI_CALL_SLOT_TABLE_NAME,
  timestamps: true,
})
export class AiCallSlot extends Model {
  public static AI_CALL_SLOT_TABLE_NAME = 'ai_call_slots';
  public static AI_CALL_SLOT_ID = 'id';
  public static AI_CALL_SLOT_CALL_LIST_ID = 'call_list_id';
  public static AI_CALL_SLOT_START_TIME = 'start_time';
  public static AI_CALL_SLOT_END_TIME = 'end_time';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: AiCallSlot.AI_CALL_SLOT_ID,
  })
  id: number;

  @ForeignKey(() => CallList)
  @Column({
    type: DataType.INTEGER,
    field: AiCallSlot.AI_CALL_SLOT_CALL_LIST_ID,
    allowNull: false,
  })
  callListId: number;

  @Column({
    type: DataType.DATE,
    field: AiCallSlot.AI_CALL_SLOT_START_TIME,
    allowNull: false,
  })
  startTime: Date;

  @Column({
    type: DataType.DATE,
    field: AiCallSlot.AI_CALL_SLOT_END_TIME,
    allowNull: false,
  })
  endTime: Date;

  @BelongsTo(() => CallList)
  callList: CallList;
}
