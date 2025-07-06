import { Table, Column, Model, DataType } from "sequelize-typescript";

import { AllowedLocale } from "@/handlers/localeHandler";

@Table({
  tableName: "users",
  timestamps: true,
  underscored: true
})
export default class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  userId!: string;
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  language: AllowedLocale | undefined;
}
