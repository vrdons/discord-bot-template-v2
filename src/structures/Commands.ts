import {
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  LocalizationMap,
  Message,
  SlashCommandBuilder,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  RGBTuple,
  ColorResolvable
} from "discord.js";
import { Replacements } from "i18n";

import { LanguageHeader, MaybePromise } from "@/types/include";
import { AllowedLanguage } from "@/types/bot";
import { LanguageHandler } from "@/handlers/langaugeHandler";

import { DefaultOptions } from "./default";
import { CooldownManager, CooldownOptions } from "./Cooldown";

export interface DefaultCommandOptions extends DefaultOptions {
  language: AllowedLanguage;
  _t: (...args: LanguageHeader) => string;
  _e: (...args: string[]) => string | undefined;
  _c: (...args: string[]) => number | RGBTuple | ColorResolvable | null;
}
export interface BuilderOptions extends DefaultOptions {
  translate: (key: string, locale?: AllowedLanguage, replace?: Replacements) => string;
  generateLocalization: (...args: LanguageHeader) => LocalizationMap;
  getDefaultLocalization: (...args: LanguageHeader) => string;
}

export type Detail = {
  allowDM?: boolean;
  accessOnly?: boolean;
};

export type SlashCommandData = {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  cooldown: CooldownOptions;
  execute(options: DefaultCommandOptions, interaction: ChatInputCommandInteraction): MaybePromise<any>;
  detail: Detail;
};
export type ContextMenuData = {
  data: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  cooldown?: CooldownOptions;
  execute(options: DefaultCommandOptions, interaction: ContextMenuCommandInteraction): MaybePromise<any>;
  detail: Detail;
};
export type PrefixCommandData = {
  data: CommandData;
  detail: Detail;
  cooldown?: CooldownOptions;
  execute(options: DefaultCommandOptions, message: Message<boolean>, args: string[], cmd: string): MaybePromise<any>;
};
export type SlashCommandOptions = {
  data: (builder: SlashCommandBuilder, options: BuilderOptions) => SlashCommandBuilder;
  cooldown: (cooldown: CooldownManager) => CooldownManager;
  execute(options: DefaultCommandOptions, interaction: ChatInputCommandInteraction): MaybePromise<any>;
  detail: Detail;
};
export type ContextMenuOptions = {
  data: (builder: ContextMenuCommandBuilder, options: BuilderOptions) => ContextMenuCommandBuilder;
  cooldown: (cooldown: CooldownManager) => CooldownManager;
  execute(options: DefaultCommandOptions, interaction: ContextMenuCommandInteraction): MaybePromise<any>;
  detail: Detail;
};
export type CommandOptions = {
  data: (builder: PrefixCommandBuilder) => PrefixCommandBuilder;
  detail: Detail;
  cooldown: (cooldown: CooldownManager) => CooldownManager;
  execute(options: DefaultCommandOptions, message: Message<boolean>, args: string[], cmd: string): MaybePromise<any>;
};
export type CommandData = {
  name: string;
  aliases: string[];
};
export class PrefixCommandBuilder {
  options: CommandData;
  constructor(private language: LanguageHandler) {
    this.options = { name: "", aliases: [] };
  }
  setName(name: string) {
    this.options.name = name;
    return this;
  }
  addAliases(...alias: string[]) {
    this.options.aliases = [...this.options.aliases, ...alias];
    return this;
  }
  setAliases(...alias: string[]) {
    this.options.aliases = [...alias];
    return this;
  }
  autoSet(...args: LanguageHeader) {
    const { name, aliases } = this.language.generateArrayCommand(...args);
    this.options.name = name;
    this.options.aliases = [...aliases];
    return this;
  }
  toJSON() {
    return this.options;
  }
}
export function CommandHandler(options: CommandOptions) {
  return options;
}
export function SlashCommandHandler(options: SlashCommandOptions) {
  return options;
}
export function ContextMenuHandler(options: ContextMenuOptions) {
  return options;
}
