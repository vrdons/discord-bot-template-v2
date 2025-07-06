import chalk from "chalk";
import { Events } from "discord.js";
import ms from "ms";

import { Handler } from "@/classes/Handler";

export default Handler.EventHandler({
  name: Events.ClientReady,
  once: false,
  handle({ bot }) {
    console.log(`${chalk.green(bot.client.user?.tag)} olarak giriş yaptım.`);
    if (process.env.SHARDING_MANAGER! == "true" && parseInt(`${process.env.SHARDS}`) == 0) {
      process.once("message", (list: any) => {
        if (list.deploy) bot.registerCommands();
      });
      bot.cooldownHandler.removeInvalidCooldowns();
      setInterval(() => {
        bot.cooldownHandler.removeInvalidCooldowns();
      }, ms("30m"));
    }
    bot.database.connect();
  }
});
