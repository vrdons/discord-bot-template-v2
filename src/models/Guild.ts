import { Table, Column, Model, DataType } from "sequelize-typescript";

import { AllowedLocale } from "@/structures/handlers/localeHandler";

@Table({
  tableName: "guilds",
  timestamps: true,
  underscored: true
})
export default class Guild extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  guildId!: string;
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  language: AllowedLocale | undefined;
}
