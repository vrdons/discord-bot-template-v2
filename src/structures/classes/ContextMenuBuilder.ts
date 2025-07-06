import { ContextMenuCommandBuilder, RESTPostAPIContextMenuApplicationCommandsJSONBody } from "discord.js";

import { LocaleHeader } from "../handlers/localeHandler";
import { Client } from "../core/Bot";
export interface ContextMenuBody extends RESTPostAPIContextMenuApplicationCommandsJSONBody {
  allowDM: boolean;
  adminOnly: boolean;
}
export class CustomContextBuilder extends ContextMenuCommandBuilder {
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

  setAllowDm(enabled?: boolean) {
    this.extraSettings.allowDM = enabled !== undefined ? enabled : !this.extraSettings.allowDM;
    return this;
  }
  setAdminOnly(enabled?: boolean) {
    this.extraSettings.adminOnly = enabled !== undefined ? enabled : !this.extraSettings.adminOnly;
    return this;
  }

  autoSet(...args: LocaleHeader) {
    this.setName(this.bot?.localeHandler.getDefaultLocalization(...this.bot?.localeHandler.addKey("name", ...args)) ?? "");
    this.setNameLocalizations(this.bot?.localeHandler.generateLocalizationMap(...this.bot?.localeHandler.addKey("name", ...args)) ?? {});
    return this;
  }
  toJSON(): ContextMenuBody {
    const { allowDM, adminOnly } = this.extraSettings;
    const json = super.toJSON();
    return {
      ...json,
      allowDM,
      adminOnly
    };
  }
}
