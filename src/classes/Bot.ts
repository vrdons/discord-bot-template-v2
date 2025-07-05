import { BitFieldResolvable, Client as TrueClient, GatewayIntentsString, Partials, REST, Routes } from "discord.js";

import { CommandHandler } from "@/handlers/commandHandler";
import { CooldownHandler } from "@/handlers/cooldownHandler";
import { DatabaseHandler } from "@/handlers/databaseHandler";
import { EmojiHandler } from "@/handlers/emojiHandler";
import { EventHandler } from "@/handlers/eventHandler";
import { LanguageHandler } from "@/handlers/langaugeHandler";

export class Client {
  public client: TrueClient<true>;
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
  public emojiHandler = new EmojiHandler();
  public languageHandler = new LanguageHandler(this.emojiHandler);
  public database = new DatabaseHandler();
  public cooldownHandler = new CooldownHandler();
  public commandHandler = new CommandHandler(this);
  public eventHandler = new EventHandler(this);
}
