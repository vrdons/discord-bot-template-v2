export enum CooldownType {
  USER = "user",
  GUILD = "guild",
  CHANNEL = "channel",
  GLOBAL = "global"
}
export interface CooldownOptions {
  cooldownTime: number;
  saveDatabase: boolean;
  enabled: boolean;
  type?: CooldownType;
}

export class CooldownManager {
  private options: CooldownOptions;
  private defaultCooldown = require("@/config/Cooldown");
  constructor(options?: Partial<CooldownOptions>) {
    if (options) {
      this.options = { ...this.defaultCooldown, ...options };
    } else {
      this.options = { ...this.defaultCooldown };
    }
  }

  setCooldownType(type: CooldownType) {
    this.options.type = type;
    return this;
  }

  setCooldownTime(time: number) {
    if (time > this.defaultCooldown.invalidSession) {
      throw new Error("Cooldown time cannot be more than the invalid session time.");
    }
    this.options.cooldownTime = time;
    return this;
  }

  setEnabled(enabled?: boolean) {
    this.options.enabled = enabled !== undefined ? enabled : !this.options.enabled;
    return this;
  }

  saveDatabase(enabled?: boolean) {
    this.setEnabled(enabled);
    return this;
  }

  toJSON() {
    return { ...this.options };
  }
}
