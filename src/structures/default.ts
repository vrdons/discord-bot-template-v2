import { Client } from "@/classes/Bot";

import { EventHandler } from "./Events";
import { CommandHandler, ContextMenuHandler, SlashCommandHandler } from "./Commands";

export interface DefaultOptions {
  bot: Client;
}

export const Handlers = {
  EventHandler,
  CommandHandler,
  SlashCommandHandler,
  ContextMenuHandler
};
