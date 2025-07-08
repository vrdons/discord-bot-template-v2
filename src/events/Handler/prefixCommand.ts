import { Events, MessageFlags } from "discord.js";

import Bot from "@/config/Bot";
import { Handler } from "@/structures/core/Handler";
import { CustomEmbed } from "@/structures/classes/CustomEmbed";
import { formatTimesamp } from "@/utils/discord";

export default Handler.EventHandler({
  name: Events.MessageCreate,
  once: false,
  async handle(options, message) {
    if (message.author.bot) {
      message.channel.messages.cache.delete(message.id);
      return;
    }

    const content = message.content.trim();
    const usedPrefix =
      typeof Bot.prefix == "string"
        ? Bot.prefix
        : Bot.prefix.sort((a, b) => b.length - a.length).find((prefix) => content.toLowerCase().startsWith(prefix));

    if (!usedPrefix) {
      message.channel.messages.cache.delete(message.id);
      return;
    }

      let [cmd, ...args] = message.content
      .slice(usedPrefix.length)
      .trim()
      .split(" ")
      .filter((x) => x);
    args = args
      .join(" ")
      .replace(/(<#(\d{17,19})>|<@!?(\d{17,19})>|<@&(\d{17,19})>)/g, "")
      .trim()
      .split(/ +/g);
    const command =
      options.bot.commandHandler.prefixCommand.get(cmd.toLowerCase()) ||
      Array.from(options.bot.commandHandler.prefixCommand.values()).find((c) => c.data.aliases?.includes(cmd.toLowerCase()));
    if (!command) {
      message.channel.messages.cache.delete(message.id);
      return;
    }

    const opts = {
      ...options,
      locale: await options.bot.localeHandler.getLocale(message.author, message?.guild),
      _e: options.bot.emojiHandler._e.bind(options.bot.emojiHandler),
      _c: options.bot.emojiHandler._c.bind(options.bot.emojiHandler),
      _t: options.bot.localeHandler._t.bind(options.bot.localeHandler, await options.bot.localeHandler.getLocale(message.author, message?.guild))
    };
    console.debug(`${message.author.username} (${message.author.id}) used command '${command.data.name}'`);
    if (command.data.adminOnly && !options.bot.permissions.isAdmin(message.author.id)) {
      console.debug(`${message.author.username} (${message.author.id}) has no access to use this command '${command.data.name}'`);
      message.channel.messages.cache.delete(message.id);
      const embed = new CustomEmbed(opts, message);
      embed.errorEmbed();
      embed.setDescription(opts._t("error", "noAccess", "admin"));
      return await message.reply({
        flags: MessageFlags.SuppressNotifications,
        embeds: [embed]
      });
    }
    if (!command.data.allowDM && message.channel?.isDMBased()) {
      console.debug(`${message.author.username} (${message.author.id}) has no access in DM '${command.data.name}'`);
      message.channel.messages.cache.delete(message.id);
      const embed = new CustomEmbed(opts, message);
      embed.errorEmbed();
      embed.setDescription(opts._t("error", "noAccess", "dm"));
      return await message.reply({
        flags: MessageFlags.SuppressNotifications,
        embeds: [embed]
      });
    }

    const cooldownCheck =
      command.cooldown &&
      (await options.bot.cooldownHandler.checkCooldown(
        command.data.name,
        command.cooldown,
        message.author.id,
        message.guild?.id,
        message.channel?.id
      ));
    if (cooldownCheck?.onCooldown) {
      if (command.cooldown?.enabled) {
        const timeLeft = Date.now() + cooldownCheck.remainingTime;
        const formatTime = formatTimesamp(timeLeft, "R");
        const embed = new CustomEmbed(opts, message);
        embed.errorEmbed();
        embed.setDescription(
          opts._t("error", "onCooldown", {
            time: formatTime
          })
        );
        await message
          .reply({
            embeds: [embed]
          })
          .then((msg) => {
            setTimeout(() => {
              msg.delete().catch(() => {});
            }, cooldownCheck.remainingTime);
          })
          .catch(() => {});
        message.channel.messages.cache.delete(message.id);

        return;
      } else {
        if (command.cooldown)
          await options.bot.cooldownHandler.resetCooldown(
            command.data.name,
            command.cooldown,
            message.author.id,
            message.guild?.id,
            message.channel?.id
          );
      }
    }
    try {
      await command.execute(opts, message, args, cmd);
      if (command.cooldown) {
        options.bot.cooldownHandler.setCooldown(command.data.name, command.cooldown, message.author.id, message.guild?.id, message.channel?.id);
      }
    } catch (error) {
      throw error;
    }
  }
});
