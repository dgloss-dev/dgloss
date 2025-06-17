import { USER_ROLE } from '@workspace/types/enums/user';
import { Model, Table, Column, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { CallList } from './callList.model';
import { CallSession } from './callSession.model';
import { VoiceDataGroup } from './voiceDataGroup.model';
import { Settings } from './settings.model';
import { MyCallList } from './myCallList.model';
import { VoiceData } from './voiceData.model';
import { Caller } from './caller.model';
import { OperatorStatus } from './operatorStatus.model';
import { CallStatusHistory } from './callStatusHistory.model';
import { CallSchedule } from './callSchedule.model';

@Table({
  tableName: User.USER_TABLE_NAME,
  timestamps: true,
})
export class User extends Model {
  public static USER_TABLE_NAME = 'users';
  public static USER_ID = 'id';
  public static USER_EMAIL = 'email';
  public static USER_ROLE = 'role';
  public static USER_NAME = 'name';
  public static USER_COGNITO_USERNAME = 'cognito_username';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: User.USER_ID,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
    field: User.USER_NAME,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    field: User.USER_EMAIL,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.ENUM(...Object.values(USER_ROLE)),
    field: User.USER_ROLE,
    defaultValue: USER_ROLE.OPERATOR,
  })
  role: USER_ROLE;

  @Column({
    type: DataType.STRING(100),
    field: User.USER_COGNITO_USERNAME,
    allowNull: false,
    unique: true,
  })
  cognitoUsername: string;

  @HasMany(() => CallList)
  callLists: CallList[];

  @HasMany(() => VoiceDataGroup)
  voiceDataGroups: VoiceDataGroup[];

  @HasMany(() => CallSession)
  callSessions: CallSession[];

  @HasMany(() => Settings)
  settings: Settings[];

  @BelongsToMany(() => Caller, () => MyCallList)
  callers: Caller[];

  @HasMany(() => VoiceData, 'createdBy')
  voiceData: VoiceData[];

  @HasMany(() => OperatorStatus, 'operatorId')
  operatorStatus: OperatorStatus[];

  @HasMany(() => CallStatusHistory, 'operatorId')
  callStatusHistories: CallStatusHistory[];

  @HasMany(() => CallStatusHistory, 'changedBy')
  changedCallStatuses: CallStatusHistory[];

  @HasMany(() => CallSchedule, 'operatorId')
  callSchedules: CallSchedule[];
}
