import ms from "ms";

import { Handler } from "@/structures/core/Handler";
export default Handler.SlashCommandHandler({
  cooldown: (manager) => manager.saveDatabase(false).setCooldownTime(ms("10s")).setEnabled(true),

  data: (builder) => builder.autoSet("commands", "status"),
  execute: async function (_options, interaction) {
    await interaction.reply({ content: "helo" });
  }
});
