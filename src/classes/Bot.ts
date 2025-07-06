import { BitFieldResolvable, Client as TrueClient, GatewayIntentsString, Partials, REST, Routes } from "discord.js";

import { CommandHandler } from "@/handlers/commandHandler";
import { CooldownHandler } from "@/handlers/cooldownHandler";
import { DatabaseHandler } from "@/handlers/databaseHandler";
import { EmojiHandler } from "@/handlers/emojiHandler";
import { EventHandler } from "@/handlers/eventHandler";
import { LocaleHandler } from "@/handlers/localeHandler";
import Locale from "@/config/Locale";
import Paths, { ePaths } from "@/config/Paths";
import Bot from "@/config/Bot";
import Cooldown from "@/config/Cooldown";
import { PermissionHandler } from "@/handlers/permissionHandler";

export class Client {
  public client: TrueClient<true>;
  public name = Bot.name;
  constructor(
    private token: string,
    intents: BitFieldResolvable<GatewayIntentsString, number>,
    partials: Partials[] = []
  ) {
    this.client = new TrueClient({
      intents,
      partials,
      allowedMentions: { repliedUser: true }
    });

    this.client.login(this.token);
    this.eventHandler.reloadEvents();
  }
  public restartAll() {
    process?.send?.({ _sRespawnAll: true });
  }
  public async registerCommands() {
    if (!this.client.isReady()) return;
    const rest = new REST().setToken(this.token);
    const commandData = [...this.commandHandler.slashCommand.values(), ...this.commandHandler.contextMenu].map((command) => command.data);
    const data = (await rest.put(Routes.applicationCommands(this.client.user?.id), { body: commandData })) as { length: number };
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  }
  public emojiHandler = new EmojiHandler(this, Paths);
  public localeHandler = new LocaleHandler(this, Locale, Paths);
  public database = new DatabaseHandler(this, Bot);
  public cooldownHandler = new CooldownHandler(this, Cooldown);
  public commandHandler = new CommandHandler(this, ePaths, Paths);
  public eventHandler = new EventHandler(this);
  public permissionHandler = new PermissionHandler(this, Bot);
}
