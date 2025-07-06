import { Client } from "@/structures/core/Bot";
import { createFolder, isFolder, loadArray } from "@/utils/file";
import { arrayToMap } from "@/utils/utils";
import { extendPaths, Paths } from "@/types/settings";
import { ContextMenuData, PrefixCommandData, SlashCommandData } from "@/types/data/command";
import { CommandOptions, ContextMenuOptions, SlashCommandOptions } from "@/types/options/command";
import { PrefixCommandBuilder } from "@/structures/classes/PrefixCommandBuilder";
import { CooldownBuilder } from "@/structures/classes/CooldownBuilder";

import { CustomSlashBuilder } from "../classes/SlashCommandBuilder";
import { CustomContextBuilder } from "../classes/ContextMenuBuilder";
export class CommandHandler {
  slashCommand: Map<string, SlashCommandData> = new Map<string, SlashCommandData>();
  prefixCommand: Map<string, PrefixCommandData> = new Map<string, PrefixCommandData>();
  contextMenu: ContextMenuData[] = [];
  constructor(
    private bot: Client,
    private ePaths: extendPaths,
    private paths: Paths
  ) {
    this.reloadCommands();
  }
  async reloadCommands() {
    if (!isFolder(this.ePaths.commandsPath)) createFolder(this.ePaths.commandsPath);
    const loadedCommands = await loadArray<CommandOptions>(this.paths.prefixCommandsPath, true, "P_COMMAND"),
      loadedSlashCommand = await loadArray<SlashCommandOptions>(this.paths.slashCommandsPath, true, "S_COMMAND"),
      loadedContextMenu = await loadArray<ContextMenuOptions>(this.paths.contextMenusPath, true, "C_COMMAND");

    this.slashCommand.clear();
    this.prefixCommand.clear();
    this.contextMenu = loadedContextMenu.map((cmd) => {
      const data = cmd
        .data(new CustomContextBuilder(this.bot), {
          bot: this.bot,
          translate: this.bot.localeHandler.translate.bind(this.bot.localeHandler),
          generateLocalization: this.bot.localeHandler.generateLocalizationMap.bind(this.bot.localeHandler),
          getDefaultLocalization: this.bot.localeHandler.getDefaultLocalization.bind(this.bot.localeHandler)
        })
        .toJSON();

      const cooldown = cmd.cooldown(new CooldownBuilder()).toJSON();

      return { ...cmd, data, cooldown };
    });

    this.prefixCommand = arrayToMap<PrefixCommandData>(
      loadedCommands.map((cmd) => {
        const data = cmd
          .data(new PrefixCommandBuilder(this.bot), {
            bot: this.bot,
            translate: this.bot.localeHandler.translate.bind(this.bot.localeHandler),
            generateLocalization: this.bot.localeHandler.generateLocalizationMap.bind(this.bot.localeHandler),
            getDefaultLocalization: this.bot.localeHandler.getDefaultLocalization.bind(this.bot.localeHandler)
          })
          .toJSON();

        const cooldown = cmd.cooldown(new CooldownBuilder()).toJSON();

        return { ...cmd, data, cooldown };
      }),
      (i) => i.data.name
    );
    this.slashCommand = arrayToMap<SlashCommandData>(
      loadedSlashCommand.map((cmd) => {
        const data = cmd
          .data(new CustomSlashBuilder(this.bot), {
            bot: this.bot,
            translate: this.bot.localeHandler.translate.bind(this.bot.localeHandler),
            generateLocalization: this.bot.localeHandler.generateLocalizationMap.bind(this.bot.localeHandler),
            getDefaultLocalization: this.bot.localeHandler.getDefaultLocalization.bind(this.bot.localeHandler)
          })
          .toJSON();

        const cooldown = cmd.cooldown(new CooldownBuilder()).toJSON();

        return { ...cmd, data, cooldown };
      }),
      (i) => i.data.name
    );
  }
}
