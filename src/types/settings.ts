import { BitFieldResolvable, GatewayIntentsString, Partials } from "discord.js";
import { SequelizeOptions } from "sequelize-typescript";

import { CooldownOptions } from "@/structures/handlers/cooldownHandler";
import { AllowedLocale } from "@/structures/handlers/localeHandler";

export interface CooldownSettings extends CooldownOptions {
  invalidSession: number;
}
export type BotSettings = {
  name: string;
  prefix: string | string[];
  admins: string[];
  intents: BitFieldResolvable<GatewayIntentsString, number>;
  partials?: Partials[];
  database: SequelizeOptions;
};
export type Paths = {
  eventsPath: string;
  prefixCommandsPath: string;
  slashCommandsPath: string;
  contextMenusPath: string;
  localesPath: string;
  emojisPath: string;
  colorsPath: string;
  databaseModelsPath: string;
};
export type extendPaths = {
  rootPath: string;
  commandsPath: string;
};
export type LocaleSettings = {
  defaultLocale: AllowedLocale;
  allowedLocales: AllowedLocale[];
};
