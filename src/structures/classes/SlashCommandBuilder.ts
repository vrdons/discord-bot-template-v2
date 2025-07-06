import { RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

import { LocaleHeader } from "../handlers/localeHandler";
import { Client } from "../core/Bot";
export interface SlashCommandBody extends RESTPostAPIChatInputApplicationCommandsJSONBody {
  allowDM: boolean;
  adminOnly: boolean;
}
export class CustomSlashBuilder extends SlashCommandBuilder {
  extraSettings: { allowDM: boolean; adminOnly: boolean };
  private bot: Client | undefined;
  constructor(_bot: Client) {
    super();
    Object.defineProperty(this, "bot", {
      value: _bot,
      writable: false,
      configurable: false,
      enumerable: false
    });
    this.extraSettings = { allowDM: true, adminOnly: false };
  }

  setALlowDm(enabled?: boolean) {
    this.extraSettings.allowDM = enabled !== undefined ? enabled : !this.extraSettings.allowDM;
    return this;
  }
  setAdminOnly(enabled?: boolean) {
    this.extraSettings.adminOnly = enabled !== undefined ? enabled : !this.extraSettings.adminOnly;
    return this;
  }

  autoSet(...args: LocaleHeader) {
    this.setName(this.bot?.localeHandler.getDefaultLocalization(...this.bot?.localeHandler.addKey("name", ...args)) ?? "");
    this.setDescription(this.bot?.localeHandler.getDefaultLocalization(...this.bot?.localeHandler.addKey("description", ...args)) ?? "");
    this.setNameLocalizations(this.bot?.localeHandler.generateLocalizationMap(...this.bot?.localeHandler.addKey("name", ...args)) ?? {});
    this.setDescriptionLocalizations(
      this.bot?.localeHandler.generateLocalizationMap(...this.bot?.localeHandler.addKey("description", ...args)) ?? {}
    );
    return this;
  }
  override toJSON(): SlashCommandBody {
    const { allowDM, adminOnly } = this.extraSettings;
    const json = super.toJSON();
    //   console.log(json);
    return {
      ...json,
      allowDM,
      adminOnly
    };
  }
}
