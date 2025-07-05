import { APIEmbed, EmbedBuilder, EmbedData, Interaction, Message, User } from "discord.js";

import { getUser, getUserOrClientAvatar } from "@/utils/api";
import Bot from "@/config/Bot";

import { DefaultCommandOptions } from "./Commands";

export class CustomEmbed extends EmbedBuilder {
  private interactionUser: User;
  constructor(
    private options: DefaultCommandOptions,
    private interaction: Interaction | Message,
    data?: EmbedData | APIEmbed
  ) {
    super(data);
    this.setColor(this.options._c("default"));
    this.interactionUser = getUser(this.interaction);
    this.setFooter({
      iconURL: getUserOrClientAvatar(this.interaction),
      text: this.options._t("embeds", "author", { year: `${new Date().getFullYear()}`, botname: Bot.name })
    });
  }
  errorEmbed() {
    this.setTitle(this.options._t("error", "text"));
    this.setColor(this.options._c("error"));
    return this;
  }
  successEmbed() {
    this.setTitle(this.options._t("success", "text"));

    this.setColor(this.options._c("success"));
    return this;
  }
}
