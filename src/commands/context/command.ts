import { ApplicationCommandType } from "discord.js";
import ms from "ms";

import { Handlers } from "@/structures/default";

export default Handlers.ContextMenuHandler({
  data(builder, _options) {
    return builder.setName("test").setType(ApplicationCommandType.User);
  },
  cooldown: (manager) => manager.saveDatabase(false).setCooldownTime(ms("10s")).setEnabled(true),
  async execute(_options, interaction) {
    await interaction.reply({ content: "helo" });
  },
  detail: {}
});
