import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: Settings.SETTINGS_TABLE_NAME,
  timestamps: true,
})
export class Settings extends Model {
  public static SETTINGS_TABLE_NAME = 'settings';
  public static SETTINGS_ID = 'id';
  public static SETTINGS_DEVICE_ID = 'device_id';
  public static SETTINGS_USER_ID = 'user_id';
  public static SETTINGS_SOUND_LEVEL = 'sound_level';

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: Settings.SETTINGS_ID,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    field: Settings.SETTINGS_DEVICE_ID,
    allowNull: false,
  })
  deviceId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: Settings.SETTINGS_USER_ID,
    allowNull: false,
    onDelete: 'CASCADE',
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
    field: Settings.SETTINGS_SOUND_LEVEL,
    allowNull: false,
  })
  soundLevel: number;

  @BelongsTo(() => User)
  user: User;
}
