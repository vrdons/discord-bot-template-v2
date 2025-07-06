import { Collection } from "discord.js";
import { Op } from "sequelize";

import CooldownModel from "@/models/Cooldown";
import { Client } from "@/structures/core/Bot";
import { CooldownSettings } from "@/types/settings";
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

type CooldownInfo = {
  expireDate: number;
  options: CooldownOptions;
};

export class CooldownHandler {
  private cooldowns: Collection<string, CooldownInfo> = new Collection();
  constructor(
    private bot: Client,
    private options: CooldownSettings
  ) {}
  private defaultOptions: CooldownOptions = {
    cooldownTime: 3000,
    enabled: true,
    type: CooldownType.USER,
    saveDatabase: false
  };
  private mergeOptions(options?: CooldownOptions): CooldownOptions {
    return {
      ...this.defaultOptions,
      ...(options ?? {})
    };
  }

  private getTargetId(options: CooldownOptions, userId: string, guildId?: string, channelId?: string): string {
    switch (options.type) {
      case CooldownType.USER:
        return userId;
      case CooldownType.GUILD:
        return guildId || "global";
      case CooldownType.CHANNEL:
        return channelId || "global";
      case CooldownType.GLOBAL:
        return "global";
      default:
        return userId;
    }
  }
  private createKey(commandId: string, targetId: string): string {
    return `${commandId}:${targetId}`;
  }

  public async setCooldown(commandId: string, options: CooldownOptions, userId: string, guildId?: string, channelId?: string) {
    const cooldownOptions = this.mergeOptions(options);
    const targetId = this.getTargetId(cooldownOptions, userId, guildId, channelId);
    const key = this.createKey(commandId, targetId);
    const expireDate = Date.now() + cooldownOptions.cooldownTime;
    this.cooldowns.set(key, { expireDate, options: cooldownOptions });

    setTimeout(() => {
      if (this.cooldowns.has(key)) {
        this.cooldowns.delete(key);
      }
    }, cooldownOptions.cooldownTime);
    if (cooldownOptions.saveDatabase) {
      CooldownModel.create({
        cooldownId: key,
        expiresDate: expireDate
      });

      setTimeout(async () => {
        if (await CooldownModel.findOne({ where: { cooldownId: key } })) {
          await CooldownModel.destroy({ where: { cooldownId: key } });
        }
      }, cooldownOptions.cooldownTime);
    }
  }

  public async checkCooldown(
    commandId: string,
    options?: CooldownOptions,
    userId?: string,
    guildId?: string,
    channelId?: string
  ): Promise<{
    onCooldown: boolean;
    remainingTime: number;
    options: CooldownOptions;
  }> {
    const cooldownOptions = this.mergeOptions(options);

    if (cooldownOptions.type === CooldownType.USER && !userId) {
      return { onCooldown: false, remainingTime: 0, options: cooldownOptions };
    }

    const targetId = this.getTargetId(cooldownOptions, userId ?? "unknown", guildId ?? "unknown", channelId ?? "unkown");
    const key = this.createKey(commandId, targetId);

    const cooldown = this.cooldowns.get(key);

    if (!cooldown) {
      const cooldown = await CooldownModel.findOne({ where: { cooldownId: key } });
      if (!cooldown) {
        return {
          onCooldown: false,
          remainingTime: 0,
          options: cooldownOptions
        };
      }

      const now = Date.now();
      const remainingTime = cooldown.expiresDate - now;
      if (remainingTime <= 0 || isNaN(remainingTime)) {
        await CooldownModel.destroy({ where: { cooldownId: key } });
        return {
          onCooldown: false,
          remainingTime: 0,
          options: cooldownOptions
        };
      }
      this.cooldowns.set(key, {
        expireDate: cooldown.expiresDate,
        options: cooldownOptions
      });

      return { onCooldown: true, remainingTime, options: cooldownOptions };
    }

    const now = Date.now();
    const remainingTime = cooldown.expireDate - now;
    if (remainingTime <= 0 || isNaN(remainingTime)) {
      this.cooldowns.delete(key);
      return { onCooldown: false, remainingTime: 0, options: cooldown.options };
    }

    return { onCooldown: true, remainingTime, options: cooldown.options };
  }

  public async resetCooldown(commandId: string, options: CooldownOptions, userId: string, guildId?: string, channelId?: string) {
    const cooldownOptions = this.mergeOptions(options);
    const targetId = this.getTargetId(cooldownOptions, userId, guildId, channelId);
    const key = this.createKey(commandId, targetId);
    this.cooldowns.delete(key);
    await CooldownModel.destroy({ where: { cooldownId: key } });
  }
  public async resetAllCooldowns() {
    this.cooldowns.clear();
    await CooldownModel.destroy({ where: {} });
  }
  public async removeInvalidCooldowns() {
    const date = Date.now() - this.options.invalidSession;
    try {
      await CooldownModel.destroy({
        where: {
          expiresDate: {
            [Op.lt]: date
          }
        }
      });
    } catch (_error) {}
  }
}
