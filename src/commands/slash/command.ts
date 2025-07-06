import ms from "ms";

import { Handler } from "@/classes/Handler";
export default Handler.SlashCommandHandler({
  cooldown: (manager) => manager.saveDatabase(false).setCooldownTime(ms("10s")).setEnabled(true),

  data: (builder, options) =>
    builder
      .setName(options.getDefaultLocalization("commands", "status", "name"))
      .setDescription(options.getDefaultLocalization("commands", "status", "description"))
      .setNameLocalizations(options.generateLocalization("commands", "status", "name"))
      .setDescriptionLocalizations(options.generateLocalization("commands", "status", "description")),
  execute: async function (_options, interaction) {
    await interaction.reply({ content: "helo" });
  },
  extra: {}
});
