import { Client } from "@/structures/core/Bot";
import { BotSettings } from "@/types/settings";

export class PermissionManager {
  constructor(
    private bot: Client,
    private config: BotSettings
  ) {}
  isAdmin(userId: string) {
    return this.config.admins.includes(userId);
  }
}
