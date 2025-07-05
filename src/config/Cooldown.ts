import ms from "ms";

import { CooldownType } from "@/structures/Cooldown";
import { CooldownOptions } from "@/types/bot";

export default {
  cooldownTime: 3000,
  enabled: true,
  type: CooldownType.USER,
  saveDatabase: false,
  invalidSession: ms("30d") //30 gün
} as CooldownOptions;
