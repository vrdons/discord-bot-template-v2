import { LocaleHandler, LocaleHeader } from "@/handlers/localeHandler";
import { CommandData } from "@/types/data/command";

export class PrefixCommandBuilder {
  options: CommandData;
  constructor(private locale: LocaleHandler) {
    this.options = { name: "", aliases: [] };
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
    const { name, aliases } = this.locale.generateArrayCommand(...args);
    this.options.name = name;
    this.options.aliases = [...aliases];
    return this;
  }
  toJSON() {
    return this.options;
  }
}
