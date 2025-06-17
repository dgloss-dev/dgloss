import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { CallList } from './callList.model';
import { MyCallList } from './myCallList.model';
import { CallerPhone } from './callerPhone.model';
import { User } from './user.model';
import { CallSchedule } from './callSchedule.model';

@Table({
  tableName: Caller.CALLER_TABLE_NAME,
  timestamps: true,
})
export class Caller extends Model {
  public static CALLER_TABLE_NAME = 'callers';
  public static CALLER_ID = 'id';
  public static CALLER_CALL_LIST_ID = 'call_list_id';
  public static CALLER_NAME = 'name';
  public static CALLER_ORDINAL_NUM = 'ordinal_num';
  public static CALLER_INDUSTRY_TYPE = 'industry_type';
  public static CALLER_EMPLOYEE = 'employee';
  public static CALLER_ANNUAL_TRADING_SESSION = 'annual_trading_session';
  public static CALLER_PERSON_IN_CHARGE = 'person_in_charge';
  public static CALLER_CALL_PERMISSION = 'call_permission';
  public static CALLER_URL = 'url';
  public static CALLER_MEMO = 'memo';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: Caller.CALLER_ID,
  })
  id: number;

  @ForeignKey(() => CallList)
  @Column({
    type: DataType.INTEGER,
    field: Caller.CALLER_CALL_LIST_ID,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  callListId: number;

  @Column({
    type: DataType.STRING(100),
    field: Caller.CALLER_NAME,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    field: Caller.CALLER_ORDINAL_NUM,
    allowNull: true,
  })
  ordinalNum: number;

  @Column({
    type: DataType.STRING(255),
    field: Caller.CALLER_INDUSTRY_TYPE,
    allowNull: true,
  })
  industryType: string;

  @Column({
    type: DataType.STRING(255),
    field: Caller.CALLER_EMPLOYEE,
    allowNull: true,
  })
  employee: string;

  @Column({
    type: DataType.STRING(255),
    field: Caller.CALLER_ANNUAL_TRADING_SESSION,
    allowNull: true,
  })
  annualTradingSession: string;

  @Column({
    type: DataType.INTEGER,
    field: Caller.CALLER_PERSON_IN_CHARGE,
    allowNull: true,
  })
  personInCharge: number;

  @Column({
    type: DataType.BOOLEAN,
    field: Caller.CALLER_CALL_PERMISSION,
    allowNull: false,
    defaultValue: false,
  })
  callPermission: boolean;

  @Column({
    type: DataType.STRING(500),
    field: Caller.CALLER_URL,
    allowNull: true,
  })
  url: string;

  @Column({
    type: DataType.TEXT,
    field: Caller.CALLER_MEMO,
    allowNull: true,
  })
  memo: string;

  @BelongsTo(() => CallList)
  callList: CallList;

  @HasMany(() => MyCallList)
  myCallLists: MyCallList[];

  @HasMany(() => CallerPhone)
  phones: CallerPhone[];

  @BelongsToMany(() => User, () => MyCallList)
  users: User[];

  @HasMany(() => CallSchedule)
  schedules: CallSchedule[];
}
