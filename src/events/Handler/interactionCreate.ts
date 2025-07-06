import chalk from "chalk";
import { Events, MessageFlags } from "discord.js";

import { Handler } from "@/classes/Handler";
import { CustomEmbed } from "@/classes/CustomEmbed";
import { formatTimesamp } from "@/utils/discord";

export default Handler.EventHandler({
  name: Events.InteractionCreate,
  once: false,
  async handle(options, interaction) {
    const opts = {
      ...options,
      locale: await options.bot.localeHandler.getLocale(interaction.user, interaction?.guild),
      _e: options.bot.emojiHandler._e.bind(options.bot.emojiHandler),
      _c: options.bot.emojiHandler._c.bind(options.bot.emojiHandler),
      _t: options.bot.localeHandler._t.bind(
        options.bot.localeHandler,
        await options.bot.localeHandler.getLocale(interaction.user, interaction?.guild)
      )
    };
    if (interaction.isChatInputCommand()) {
      const command = options.bot.commandHandler.slashCommand.get(interaction.commandName);
      console.debug(`${interaction.user.username} (${interaction.user.id}) used command '${interaction.commandName}' (${interaction.commandId})`);
      if (!command) {
        console.error(chalk.redBright(`'${interaction.commandName}' (${interaction.commandId}) was not found.`));
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        return;
      }

      if (command.extra.accessOnly && !options.bot.permissionHandler.isAdmin(interaction.user.id)) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access to use this command '${interaction.commandName}' (${interaction.commandId}) `
        );
        const embed = new CustomEmbed(opts, interaction);
        embed.errorEmbed();
        embed.setDescription(opts._t("error", "noAccess", "admin"));
        return await interaction.reply({
          flags: MessageFlags.Ephemeral,
          embeds: [embed]
        });
      }
      if (!command.extra.allowDM && interaction.channel?.isDMBased()) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access in DM '${interaction.commandName}' (${interaction.commandId}) `
        );
        const embed = new CustomEmbed(opts, interaction);
        embed.errorEmbed();
        embed.setDescription(opts._t("error", "noAccess", "dm"));
        return await interaction.reply({
          flags: MessageFlags.Ephemeral,
          embeds: [embed]
        });
      }
      const cooldownCheck =
        command.cooldown &&
        (await options.bot.cooldownHandler.checkCooldown(
          command.data.name,
          command.cooldown,
          interaction.user.id,
          interaction.guild?.id,
          interaction.channel?.id
        ));

      if (cooldownCheck?.onCooldown) {
        if (command.cooldown?.enabled) {
          const timeLeft = Date.now() + cooldownCheck.remainingTime;
          const formatTime = formatTimesamp(timeLeft, "R");
          const embed = new CustomEmbed(opts, interaction);
          embed.errorEmbed();
          embed.setDescription(
            opts._t("error", "onCooldown", {
              time: formatTime
            })
          );

          await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
          });

          return;
        } else {
          if (command.cooldown)
            await options.bot.cooldownHandler.resetCooldown(
              command.data.name,
              command.cooldown,
              interaction.user.id,
              interaction.guild?.id,
              interaction.channel?.id
            );
        }
      }
      try {
        await command.execute(opts, interaction);
        if (command.cooldown) {
          options.bot.cooldownHandler.setCooldown(
            command.data.name,
            command.cooldown,
            interaction.user.id,
            interaction.guild?.id,
            interaction.channel?.id
          );
        }
      } catch (err) {
        throw err;
      }
    } else if (interaction.isContextMenuCommand()) {
      const command = options.bot.commandHandler.contextMenu.find(
        (cmd) => cmd.data.name === interaction.commandName && cmd.data.type !== undefined && cmd.data.type === interaction.commandType
      );
      console.debug(`${interaction.user.username} (${interaction.user.id}) used context '${interaction.commandName}' (${interaction.commandId}) `);
      if (!command) {
        console.error(chalk.redBright(`'${interaction.commandName}' (${interaction.commandId}) was not found.`));

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        return;
      }
      if (command.extra.accessOnly && !options.bot.permissionHandler.isAdmin(interaction.user.id)) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access to use this command '${interaction.commandName}' (${interaction.commandId}) `
        );
        const embed = new CustomEmbed(opts, interaction);
        embed.errorEmbed();
        embed.setDescription(opts._t("error", "noAccess", "admin"));
        return await interaction.reply({
          flags: MessageFlags.Ephemeral,
          embeds: [embed]
        });
      }
      if (!command.extra.allowDM && interaction.channel?.isDMBased()) {
        console.debug(
          `${interaction.user.username} (${interaction.user.id}) has no access in DM '${interaction.commandName}' (${interaction.commandId}) `
        );
        const embed = new CustomEmbed(opts, interaction);
        embed.errorEmbed();
        embed.setDescription(opts._t("error", "noAccess", "dm"));
        return await interaction.reply({
          flags: MessageFlags.Ephemeral,
          embeds: [embed]
        });
      }
      const cooldownCheck =
        command.cooldown &&
        (await options.bot.cooldownHandler.checkCooldown(
          command.data.name,
          command.cooldown,
          interaction.user.id,
          interaction.guild?.id,
          interaction.channel?.id
        ));

      if (cooldownCheck?.onCooldown) {
        if (command.cooldown?.enabled) {
          const timeLeft = Date.now() + cooldownCheck.remainingTime;
          const formatTime = formatTimesamp(timeLeft, "R");
          const cooldownMessage = opts._t("error", "onCooldown", {
            time: formatTime
          });

          await interaction.reply({
            content: cooldownMessage,
            flags: MessageFlags.Ephemeral
          });

          return;
        } else {
          if (command.cooldown)
            await options.bot.cooldownHandler.resetCooldown(
              command.data.name,
              command.cooldown,
              interaction.user.id,
              interaction.guild?.id,
              interaction.channel?.id
            );
        }
      }
      try {
        await command.execute(opts, interaction);
        if (command.cooldown) {
          options.bot.cooldownHandler.setCooldown(
            command.data.name,
            command.cooldown,
            interaction.user.id,
            interaction.guild?.id,
            interaction.channel?.id
          );
        }
      } catch (err) {
        throw err;
      }
    }
  }
});
