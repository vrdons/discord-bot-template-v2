import {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody
} from "discord.js";

import { CooldownOptions } from "@/handlers/cooldownHandler";

import { ExtraSettings } from "../options/command";
import { MaybePromise } from "../global";

import { DefaultCommandOptions } from "@/structures/Commands";

export type SlashCommandData = {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  cooldown: CooldownOptions;
  execute(options: DefaultCommandOptions, interaction: ChatInputCommandInteraction): MaybePromise<any>;
  extra: ExtraSettings;
};
export type ContextMenuData = {
  data: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  cooldown?: CooldownOptions;
  execute(options: DefaultCommandOptions, interaction: ContextMenuCommandInteraction): MaybePromise<any>;
  extra: ExtraSettings;
};
export type CommandData = {
  name: string;
  aliases: string[];
};
export type PrefixCommandData = {
  data: CommandData;
  cooldown?: CooldownOptions;
  execute(options: DefaultCommandOptions, message: Message<boolean>, args: string[], cmd: string): MaybePromise<any>;
  extra: ExtraSettings;
};
