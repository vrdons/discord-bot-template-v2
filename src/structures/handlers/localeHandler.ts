import { Guild, Locale, LocalizationMap, User } from "discord.js";
import { I18n, Replacements } from "i18n";

import { createFolder, isFolder } from "@/utils/file";
import UserDatabase from "@/models/User";
import GuildDatabase from "@/models/Guild";
import { isObject } from "@/utils/utils";
import { LocaleSettings, Paths } from "@/types/settings";
import { Client } from "@/structures/core/Bot";

export type AllowedLocale = Locale;
export type LocaleHeader = (string | Replacements)[];
export type LocaleHandlerInstance = InstanceType<typeof LocaleHandler>;

export class LocaleHandler {
  private i18n = new I18n();
  constructor(
    private bot: Client,
    private config: LocaleSettings,
    private paths: Paths
  ) {
    if (!isFolder(this.paths.localesPath)) createFolder(this.paths.localesPath);
    this.i18n.configure({
      locales: this.config.allowedLocales,
      directory: this.paths.localesPath,
      defaultLocale: this.config.defaultLocale,
      objectNotation: true,
      autoReload: true
      //  retryInDefaultLocale: false,
    });
    this.i18n.setLocale(this.config.defaultLocale);
  }
  translate(key: string, locale?: AllowedLocale, replace?: Replacements) {
    const value = this.i18n.__({ phrase: key, locale: locale ?? this.config.defaultLocale }, replace ?? {});
    try {
      if (isObject(value)) return key;
      if (!this.bot.emojiHandler) return value;
      return this.bot.emojiHandler.putEmoji(value);
    } catch {
      return value;
    }
  }
  private parseTranslationArgs(...rest: LocaleHeader): [string[], Replacements] {
    if (rest.length === 0) {
      throw new Error("No key provided for translation. Please provide a key to translate.");
    }

    const keys: string[] = [];

    for (const arg of rest) {
      if (typeof arg === "string") {
        keys.push(arg);
      } else if (typeof arg === "object" && arg !== null) {
        return [keys, arg];
      } else {
        break;
      }
    }

    return [keys, {}];
  }
  addKey(str: string, ...args: LocaleHeader): LocaleHeader {
    const [Keys, Replace] = this.parseTranslationArgs(...args);
    Keys.push(str);
    return [...Keys, Replace];
  }
  generateLocalizationArray(...args: LocaleHeader) {
    const [Keys, Replace] = this.parseTranslationArgs(...args);
    const key = Keys.join(".");
    const languages = this.config.allowedLocales;
    const localizationArray = [];
    for (const language of languages) {
      const translation = this.translate(key, language, Replace);
      if (!translation || translation === key || isObject(translation)) continue;
      localizationArray.push({ language, translation });
    }
    return localizationArray;
  }
  generateLocalizationMap(...args: LocaleHeader): LocalizationMap {
    const [Keys, Replace] = this.parseTranslationArgs(...args);
    const key = Keys.join(".");
    const languages = this.config.allowedLocales;
    const localizationMap: LocalizationMap = {};
    for (const language of languages) {
      const translation = this.translate(key, language, Replace);
      if (!translation || translation === key || isObject(translation)) continue;
      localizationMap[language] = translation;
    }
    return localizationMap;
  }

  getDefaultLocalization(...args: LocaleHeader): string {
    const [Keys, Replace] = this.parseTranslationArgs(...args);
    const locale = this.config.defaultLocale;
    let key = Keys.join(".");
    const translation = this.translate(key, locale, Replace);
    if (!translation || translation === key || isObject(translation)) return key;
    return translation;
  }

  _t(...args: LocaleHeader): string {
    const [language, ...rest] = args;
    const [Keys, Replace] = this.parseTranslationArgs(...(rest as LocaleHeader));
    let key = Keys.join(".");
    return this.translate(key, language as AllowedLocale, Replace);
  }

  async getLocale(user: User, guild?: Guild | null): Promise<AllowedLocale> {
    const userValue = await UserDatabase?.findOne({
      where: { userId: user?.id }
    });

    const userLang = userValue?.language as AllowedLocale | undefined;
    if (userLang && this.config.allowedLocales.includes(userLang)) {
      return userLang;
    }

    const guildId = guild?.id;
    if (!guildId) return this.config.defaultLocale;

    const guildValue = await GuildDatabase.findOne({
      where: { guildId }
    });

    const guildLang = (guildValue?.language || guild?.preferredLocale) as AllowedLocale;
    if (this.config.allowedLocales.includes(guildLang)) {
      return guildLang;
    }

    return this.config.defaultLocale;
  }
}
