import { ChatInputCommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, Message, SlashCommandBuilder } from "discord.js";

import { AllowedLocale, LocaleHandler } from "@/handlers/localeHandler";
import { EmojiHandler } from "@/handlers/emojiHandler";
import { CooldownManager } from "@/classes/CooldownManager";
import { PrefixCommandBuilder } from "@/classes/PrefixCommandBuilder";

import { MaybePromise } from "../global";

import { DefaultOptions } from "./default";

type LocaleHandlerInstance = InstanceType<typeof LocaleHandler>;
type EmojiHandlerInstance = InstanceType<typeof EmojiHandler>;
export interface BuilderOptions extends DefaultOptions {
  translate: LocaleHandlerInstance["translate"];
  generateLocalization: LocaleHandlerInstance["generateLocalization"];
  getDefaultLocalization: LocaleHandlerInstance["getDefaultLocalization"];
}

export interface DefaultCommandOptions extends DefaultOptions {
  locale: AllowedLocale;
  _t: LocaleHandlerInstance["_t"];
  _e: EmojiHandlerInstance["_e"];
  _c: EmojiHandlerInstance["_c"];
}
export type ExtraSettings = {
  allowDM?: boolean;
  accessOnly?: boolean;
};

export type SlashCommandOptions = {
  data: (builder: SlashCommandBuilder, options: BuilderOptions) => SlashCommandBuilder;
  cooldown: (cooldown: CooldownManager) => CooldownManager;
  execute(options: DefaultCommandOptions, interaction: ChatInputCommandInteraction): MaybePromise<any>;
  extra: ExtraSettings;
};
export type ContextMenuOptions = {
  data: (builder: ContextMenuCommandBuilder, options: BuilderOptions) => ContextMenuCommandBuilder;
  cooldown: (cooldown: CooldownManager) => CooldownManager;
  execute(options: DefaultCommandOptions, interaction: ContextMenuCommandInteraction): MaybePromise<any>;
  extra: ExtraSettings;
};
export type CommandOptions = {
  data: (builder: PrefixCommandBuilder, options: BuilderOptions) => PrefixCommandBuilder;
  extra: ExtraSettings;
  cooldown: (cooldown: CooldownManager) => CooldownManager;
  execute(options: DefaultCommandOptions, message: Message<boolean>, args: string[], cmd: string): MaybePromise<any>;
};
