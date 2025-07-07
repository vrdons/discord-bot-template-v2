import { LocaleHeader } from "@/structures/handlers/localeHandler";

import { Client } from "../core/Bot";
export type PrefixBody = {
  name: string;
  aliases: string[];
  allowDM: boolean;
  adminOnly: boolean;
};
export class PrefixCommandBuilder {
  options: PrefixBody;
  constructor(private bot: Client) {
    this.options = { name: "", aliases: [], allowDM: true, adminOnly: false };
  }
  setAllowDm(enabled?: boolean) {
    this.options.allowDM = enabled !== undefined ? enabled : !this.options.allowDM;
    return this;
  }
  setAdminOnly(enabled?: boolean) {
    this.options.adminOnly = enabled !== undefined ? enabled : !this.options.adminOnly;
    return this;
  }
  setName(name: string) {
    this.options.name = name;
    return this;
  }
  addAliases(...alias: string[]) {
    this.options.aliases = [...this.options.aliases, ...alias];
    return this;
  }
  setAliases(...alias: string[]) {
    this.options.aliases = [...alias];
    return this;
  }
  autoSet(...args: LocaleHeader) {
    const name = this.bot.localeHandler.getDefaultLocalization(...this.bot.localeHandler.addKey("name", ...args));
    const alias = this.bot.localeHandler.generateLocalizationArray(...this.bot.localeHandler.addKey("aliases", ...args));
    const aliasArray = alias.flatMap((x) => x.translation.split(","));
    this.options.name = name;
    this.options.aliases = [...aliasArray];
    return this;
  }
  toJSON() {
    return this.options;
  }
}
