import { ClientEvents } from "discord.js";

import { EventHandlerOptions } from "@/types/options/eventHandler";
import { CommandOptions, ContextMenuOptions, SlashCommandOptions } from "@/types/options/command";

export class Handler {
  static EventHandler<K extends keyof ClientEvents>(options: EventHandlerOptions<K>) {
    return options;
  }
  static CommandHandler(options: CommandOptions) {
    return options;
  }
  static SlashCommandHandler(options: SlashCommandOptions) {
    return options;
  }
  static ContextMenuHandler(options: ContextMenuOptions) {
    return options;
  }
}
