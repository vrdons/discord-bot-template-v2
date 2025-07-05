import { ContextMenuCommandBuilder, SlashCommandBuilder } from "discord.js";

import { Client } from "@/classes/Bot";
import Paths, { commandsPath } from "@/config/Paths";
import {
  CommandOptions,
  ContextMenuData,
  ContextMenuOptions,
  PrefixCommandBuilder,
  PrefixCommandData,
  SlashCommandData,
  SlashCommandOptions
} from "@/structures/Commands";
import { CooldownManager } from "@/structures/Cooldown";
import { createFolder, isFolder, loadArray } from "@/utils/file";
import { arrayToMap } from "@/utils/utils";
export class CommandHandler {
  slashCommand: Map<string, SlashCommandData> = new Map<string, SlashCommandData>();
  prefixCommand: Map<string, PrefixCommandData> = new Map<string, PrefixCommandData>();
  contextMenu: ContextMenuData[] = [];
  constructor(private bot: Client) {
    this.reloadCommands();
  }
  async reloadCommands() {
    if (!isFolder(commandsPath)) createFolder(commandsPath);
    const loadedCommands = await loadArray<CommandOptions>(Paths.prefixCommandsPath, true, "P_COMMAND"),
      loadedSlashCommand = await loadArray<SlashCommandOptions>(Paths.slashCommandsPath, true, "S_COMMAND"),
      loadedContextMenu = await loadArray<ContextMenuOptions>(Paths.contextMenusPath, true, "C_COMMAND");

    this.slashCommand.clear();
    this.prefixCommand.clear();
    this.contextMenu = loadedContextMenu.map((cmd) => {
      let command = { ...cmd } as any;
      command.data = cmd
        .data(new ContextMenuCommandBuilder(), {
          bot: this.bot,
          translate: this.bot.languageHandler.translate.bind(this.bot.languageHandler),
          generateLocalization: this.bot.languageHandler.generateLocalization.bind(this.bot.languageHandler),
          getDefaultLocalization: this.bot.languageHandler.getDefaultLocalization.bind(this.bot.languageHandler)
        })
        .toJSON();
      return command;
    }) as ContextMenuData[];

    this.prefixCommand = arrayToMap<PrefixCommandData>(
      loadedCommands.map((cmd) => {
        let command = { ...cmd } as any;
        command.data = cmd.data(new PrefixCommandBuilder(this.bot.languageHandler)).toJSON();
        command.cooldown = cmd.cooldown(new CooldownManager()).toJSON();
        return command;
      }) as PrefixCommandData[],
      (i) => i.data.name
    );
    this.slashCommand = arrayToMap<SlashCommandData>(
      loadedSlashCommand.map((cmd) => {
        let command = { ...cmd } as any;
        command.data = cmd
          .data(new SlashCommandBuilder(), {
            bot: this.bot,
            translate: this.bot.languageHandler.translate.bind(this.bot.languageHandler),
            generateLocalization: this.bot.languageHandler.generateLocalization.bind(this.bot.languageHandler),
            getDefaultLocalization: this.bot.languageHandler.getDefaultLocalization.bind(this.bot.languageHandler)
          })
          .toJSON();
        command.cooldown = cmd.cooldown(new CooldownManager()).toJSON();
        return command;
      }) as SlashCommandData[],
      (i) => i.data.name
    );
  }
}
