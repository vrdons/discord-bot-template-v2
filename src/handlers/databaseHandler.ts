import { Sequelize, SequelizeOptions } from "sequelize-typescript";

import Bot from "@/config/Bot";

export class DatabaseHandler {
  database: Sequelize;
  constructor() {
    const config = {
      ...Bot.database,
      dialectOptions: {
        charset: "utf8",
        collate: "utf8_unicode_ci",
        clientEncoding: "UTF8"
      },
      define: {
        charset: "utf8",
        collate: "utf8_unicode_ci"
      }
    } as SequelizeOptions;
    this.database = new Sequelize(config);
  }
  async sync() {
    await this.database.sync({ alter: true });
  }
  async connect() {
    await this.database.authenticate();
    this.sync();
    console.log("Database sekronize edildi.");
  }
  async disconnect() {
    this.database.close();
  }
}
