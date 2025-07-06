import { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from "discord.js";

import { CooldownOptions } from "@/structures/handlers/cooldownHandler";
import { SlashCommandBody } from "@/structures/classes/SlashCommandBuilder";
import { ContextMenuBody } from "@/structures/classes/ContextMenuBuilder";
import { PrefixBody } from "@/structures/classes/PrefixCommandBuilder";

import { DefaultCommandOptions } from "../options/command";
import { MaybePromise } from "../global";

export type SlashCommandData = {
  data: SlashCommandBody;
  cooldown: CooldownOptions;
  execute(options: DefaultCommandOptions, interaction: ChatInputCommandInteraction): MaybePromise<any>;
};
export type ContextMenuData = {
  data: ContextMenuBody;
  cooldown?: CooldownOptions;
  execute(options: DefaultCommandOptions, interaction: ContextMenuCommandInteraction): MaybePromise<any>;
};

export type PrefixCommandData = {
  data: PrefixBody;
  cooldown?: CooldownOptions;
  execute(options: DefaultCommandOptions, message: Message<boolean>, args: string[], cmd: string): MaybePromise<any>;
};
