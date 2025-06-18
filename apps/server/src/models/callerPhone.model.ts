import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Caller } from './caller.model';
import { CALLER_PHONE_SLOT } from '@workspace/types/enums/callerPhone';

@Table({
  tableName: CallerPhone.CALLER_PHONE_TABLE_NAME,
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['caller_id', 'slot'],
    },
  ],
})
export class CallerPhone extends Model {
  public static CALLER_PHONE_TABLE_NAME = 'caller_phones';
  public static CALLER_PHONE_ID = 'id';
  public static CALLER_PHONE_CALLER_ID = 'caller_id';
  public static CALLER_PHONE_NUMBER = 'phone_number';
  public static CALLER_PHONE_SLOT = 'slot';

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

  @Column({
    type: DataType.ENUM(...Object.values(CALLER_PHONE_SLOT)),
    field: CallerPhone.CALLER_PHONE_SLOT,
    allowNull: false,
  })
  slot: CALLER_PHONE_SLOT;

  @BelongsTo(() => Caller)
  caller: Caller;
}
