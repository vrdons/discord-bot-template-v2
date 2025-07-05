import { GatewayIntentBits, Partials } from "discord.js";

import { BotConfig } from "@/types/bot";

import Paths from "./Paths";

export default {
  name: "",
  prefix: ["!", "!!"],
  admins: [],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.User, Partials.Channel, Partials.Message],
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "postgres",
    dialect: "postgres",
    logging: false,
    models: [Paths.databaseModelsPath]
  }
} as BotConfig;
