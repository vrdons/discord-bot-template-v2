import { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";

import { AllowedLocale, LocaleHandler } from "@/structures/handlers/localeHandler";
import { EmojiHandler } from "@/structures/handlers/emojiHandler";
import { CooldownBuilder } from "@/structures/classes/CooldownBuilder";
import { PrefixCommandBuilder } from "@/structures/classes/PrefixCommandBuilder";
import { CustomSlashBuilder } from "@/structures/classes/SlashCommandBuilder";
import { CustomContextBuilder } from "@/structures/classes/ContextMenuBuilder";

import { MaybePromise } from "../global";

import { DefaultOptions } from "./default";

type LocaleHandlerInstance = InstanceType<typeof LocaleHandler>;
type EmojiHandlerInstance = InstanceType<typeof EmojiHandler>;
export interface BuilderOptions extends DefaultOptions {
  translate: LocaleHandlerInstance["translate"];
  generateLocalization: LocaleHandlerInstance["generateLocalizationMap"];
  getDefaultLocalization: LocaleHandlerInstance["getDefaultLocalization"];
}

export interface DefaultCommandOptions extends DefaultOptions {
  locale: AllowedLocale;
  _t: LocaleHandlerInstance["_t"];
  _e: EmojiHandlerInstance["_e"];
  _c: EmojiHandlerInstance["_c"];
}

export type SlashCommandOptions = {
  data: (builder: CustomSlashBuilder, options: BuilderOptions) => CustomSlashBuilder;
  cooldown: (cooldown: CooldownBuilder) => CooldownBuilder;
  execute(options: DefaultCommandOptions, interaction: ChatInputCommandInteraction): MaybePromise<any>;
};
export type ContextMenuOptions = {
  data: (builder: CustomContextBuilder, options: BuilderOptions) => CustomContextBuilder;
  cooldown: (cooldown: CooldownBuilder) => CooldownBuilder;
  execute(options: DefaultCommandOptions, interaction: ContextMenuCommandInteraction): MaybePromise<any>;
};
export type CommandOptions = {
  data: (builder: PrefixCommandBuilder, options: BuilderOptions) => PrefixCommandBuilder;
  cooldown: (cooldown: CooldownBuilder) => CooldownBuilder;
  execute(options: DefaultCommandOptions, message: Message<boolean>, args: string[], cmd: string): MaybePromise<any>;
};
