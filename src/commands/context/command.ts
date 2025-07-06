import { ApplicationCommandType } from "discord.js";
import ms from "ms";

import { Handler } from "@/classes/Handler";
export default Handler.ContextMenuHandler({
  data(builder, _options) {
    return builder.setName("test").setType(ApplicationCommandType.User);
  },
  cooldown: (manager) => manager.saveDatabase(false).setCooldownTime(ms("10s")).setEnabled(true),
  async execute(_options, interaction) {
    await interaction.reply({ content: "helo" });
  },
  extra: {}
});
