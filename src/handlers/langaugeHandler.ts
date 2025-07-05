import { Guild, LocalizationMap, User } from "discord.js";
import { I18n, Replacements } from "i18n";

import { AllowedLanguage } from "@/types/bot";
import { createFolder, isFolder } from "@/utils/file";
import Paths from "@/config/Paths";
import LanguageConfig from "@/config/Language";
import UserDatabase from "@/models/User";
import GuildDatabase from "@/models/Guild";
import Language from "@/config/Language";
import { isObject } from "@/utils/utils";
import { LanguageHeader } from "@/types/include";

import { EmojiHandler } from "./emojiHandler";
export class LanguageHandler {
  defaultLocale: AllowedLanguage = LanguageConfig.defaultLanguage;
  private i18n = new I18n();
  constructor(private emojiHandler?: EmojiHandler) {
    if (!isFolder(Paths.languagePath)) createFolder(Paths.languagePath);
    this.i18n.configure({
      locales: LanguageConfig.allowedLanguages,
      directory: Paths.languagePath,
      defaultLocale: this.defaultLocale,
      objectNotation: true,
      autoReload: true
      //  retryInDefaultLocale: false,
    });
    this.i18n.setLocale(this.defaultLocale);
  }
  translate(key: string, locale?: AllowedLanguage, replace?: Replacements) {
    const value = this.i18n.__({ phrase: key, locale: locale ?? this.defaultLocale }, replace ?? {});
    try {
      if (isObject(value)) return key;
      if (!this.emojiHandler) return value;
      return this.emojiHandler.putEmoji(value);
    } catch (_error) {
      return value;
    }
  }
  private parseTranslationArgs(...rest: LanguageHeader): [string[], Replacements] {
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
  generateArrayCommand(...args: LanguageHeader) {
    const [Keys, Replace] = this.parseTranslationArgs(...args);
    const key = Keys.join(".") + ".name";
    const alias_key = Keys.join(".") + ".aliases";
    const languages = LanguageConfig.allowedLanguages;
    let localizationArray: string[] = [""];
    let localizationAliasArray: string[] = [""];
    for (const language of languages) {
      const translation = this.translate(key, language, Replace);
      if (!translation || translation === key || isObject(translation)) continue;
      localizationArray.push(translation);
    }
    for (const language of languages) {
      const translation_alias = this.translate(alias_key, language, Replace);
      if (!translation_alias || translation_alias === key || isObject(translation_alias)) continue;
      localizationAliasArray.push(translation_alias);
    }
    const aliasArray = localizationAliasArray.flatMap((x) => x.split(","));
    return {
      name: this.getDefaultLocalization(key),
      aliases: [...aliasArray, ...localizationArray].filter((x) => x.length !== 0)
    };
  }
  generateLocalization(...args: LanguageHeader): LocalizationMap {
    const [Keys, Replace] = this.parseTranslationArgs(...args);
    const key = Keys.join(".");
    const languages = LanguageConfig.allowedLanguages;
    const localizationMap: LocalizationMap = {};
    for (const language of languages) {
      const translation = this.translate(key, language, Replace);
      if (!translation || translation === key || isObject(translation)) continue;
      localizationMap[language] = translation;
    }
    return localizationMap;
  }

  getDefaultLocalization(...args: LanguageHeader): string {
    const [Keys, Replace] = this.parseTranslationArgs(...args);
    const locale = this.defaultLocale;
    let key = Keys.join(".");
    const translation = this.translate(key, locale, Replace);
    if (!translation || translation === key || isObject(translation)) return key;
    return translation;
  }

  _t(...args: LanguageHeader): string {
    const [language, ...rest] = args;
    const [Keys, Replace] = this.parseTranslationArgs(...(rest as LanguageHeader));
    let key = Keys.join(".");
    return this.translate(key, language as AllowedLanguage, Replace);
  }

  async getLocale(user: User, guild?: Guild | null): Promise<AllowedLanguage> {
    try {
      if (!user) throw new Error("User is not provided");
      const userValue = await UserDatabase.findOne({
        where: { userId: user.id }
      });
      if (!userValue || !userValue?.language) throw new Error("User language not found in database");
      if (!Language.allowedLanguages.includes(userValue.language)) throw new Error("User language is not allowed");
      return userValue.language;
    } catch (_error) {
      if (!guild) throw new Error("Guild is not provided");
      try {
        const guildValue = await GuildDatabase.findOne({
          where: { guildId: guild?.id }
        });
        let lang = guildValue?.language as AllowedLanguage;
        if (!guildValue || !guildValue?.language) {
          lang = guild.preferredLocale;
        }
        if (!Language.allowedLanguages.includes(lang)) throw new Error("Guild language is not allowed");
        return lang;
      } catch (_error) {
        return this.defaultLocale;
      }
    }
  }
}
