import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Caller } from './caller.model';

@Table({
  tableName: CallerPhone.CALLER_PHONE_TABLE_NAME,
  timestamps: true,
})
export class CallerPhone extends Model {
  public static CALLER_PHONE_TABLE_NAME = 'caller_phones';
  public static CALLER_PHONE_ID = 'id';
  public static CALLER_PHONE_CALLER_ID = 'caller_id';
  public static CALLER_PHONE_NUMBER = 'phone_number';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: CallerPhone.CALLER_PHONE_ID,
  })
  id: number;

  @ForeignKey(() => Caller)
  @Column({
    type: DataType.INTEGER,
    field: CallerPhone.CALLER_PHONE_CALLER_ID,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  callerId: number;

  @Column({
    type: DataType.STRING(50),
    field: CallerPhone.CALLER_PHONE_NUMBER,
    allowNull: false,
  })
  phoneNumber: string;

  @BelongsTo(() => Caller)
  caller: Caller;
}
