import { BitFieldResolvable, GatewayIntentsString, Locale, LocaleString, Partials } from "discord.js";
import { SequelizeOptions } from "sequelize-typescript";

export type AllowedLanguage = LocaleString | Locale;
import { CooldownOptions as co } from "@/structures/Cooldown";
export type BotConfig = {
  name: string;
  prefix: string;
  admins: string[];
  intents: BitFieldResolvable<GatewayIntentsString, number>;
  partials?: Partials[];
  database: SequelizeOptions;
};
export type LanguageConfig = {
  defaultLanguage: AllowedLanguage;
  allowedLanguages: AllowedLanguage[];
};
export interface CooldownOptions extends co {
  invalidSession: number;
}
export {};
