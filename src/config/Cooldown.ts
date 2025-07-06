import ms from "ms";

import { CooldownSettings } from "@/types/settings";
import { CooldownType } from "@/structures/handlers/cooldownHandler";

export default {
  cooldownTime: 3000,
  enabled: true,
  type: CooldownType.USER,
  saveDatabase: false,
  invalidSession: ms("30d") //30 gün
} as CooldownSettings;
