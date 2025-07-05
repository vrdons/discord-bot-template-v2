import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "cooldowns",
  timestamps: true,
  underscored: true
})
export default class Cooldown extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false
  })
  cooldownId!: string;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: false
  })
  expiresDate!: number;
}
