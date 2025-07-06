import { Client } from "@/classes/Bot";
import { BotSettings } from "@/types/settings";

export class PermissionHandler {
  constructor(
    private bot: Client,
    private config: BotSettings
  ) {}
  isAdmin(userId: string) {
    return this.config.admins.includes(userId);
  }
}
