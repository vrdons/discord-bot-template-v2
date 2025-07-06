import { ClientEvents } from "discord.js";

import { Client } from "@/structures/core/Bot";
import Paths from "@/config/Paths";
import { createFolder, isFolder, loadArray } from "@/utils/file";
import { EventHandlerOptions } from "@/types/options/eventHandler";
export class EventHandler {
  constructor(private bot: Client) {}
  async reloadEvents() {
    this.bot.client.removeAllListeners();
    if (!isFolder(Paths.eventsPath)) return createFolder(Paths.eventsPath);
    const events = await loadArray<EventHandlerOptions<keyof ClientEvents>>(Paths.eventsPath, true, "EVENTS");
    this.bot.client.on("shardReady", () => process?.send?.({ _ready: true }));
    this.bot.client.on("shardDisconnect", () => process?.send?.({ _disconnect: true }));
    this.bot.client.on("shardReconnecting", () => process?.send?.({ _reconnecting: true }));
    [...events].forEach((event) => {
      this.bot.client[event.once ? "once" : "on"](event.name, (...args) => event.handle({ bot: this.bot }, ...args));
    });
  }
}
