import path from "path";

import { ShardingManager } from "discord.js";
import chalk from "chalk";
const filePath = path.resolve(".", "src", "index.ts");
process
  .on("unhandledRejection", (error) => {
    console.log("Unhandled promise rejection");
    console.error(error as Error);
  })
  .on("uncaughtException", (error) => {
    console.log("Uncaught exception");
    console.error(error as Error);
  });

const manager = new ShardingManager(filePath, {
  totalShards: isNaN(parseInt(process.env.SHARD_COUNT!)) ? "auto" : parseInt(process.env.SHARD_COUNT!),
  respawn: true,
  token: process.env.DISCORD_TOKEN!,
  execArgv: ["--bun", "--env-file=.env"]
});

let first = false;
manager.on("shardCreate", (shard) => {
  shard.on("ready", () => {
    if (!first) {
      shard.send({ deploy: true });
      first = true;
    }
  });

  shard.on("disconnect", () => console.log(`${chalk.gray(`[${chalk.red(shard.id)}]`)} Çevrimdışı`));
  //  shard.on("reconnecting", () => console.log(`[${shard.id}] Yeniden bağlanılıyor`));
  shard.on("message", (msg) => console.log(JSON.stringify(msg)));
  console.log(`${chalk.gray(`[${chalk.red(shard.id)}]`)} Başlatıldı!`);
});
manager.spawn();
