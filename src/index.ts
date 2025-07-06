import chalk from "chalk";

import { Client } from "./structures/core/Bot";
import Bot from "./config/Bot";
const clog = console.log;
const formatText = () => `${chalk.gray(`[${chalk.red(process.env.SHARDS!)}]`)}`;
console.log = (...args) => clog(`${chalk.gray("[INFO]")} ${formatText()}`, ...args);
console.debug = (...args) => clog(`${chalk.gray("[DEBUG]")} ${formatText()}`, ...args);
console.error = (...args) => clog(`${chalk.red("[ERROR]")} ${formatText()}`, ...args);
const BOT_TOKEN = process.env.DISCORD_TOKEN!;
new Client(BOT_TOKEN, Bot.intents, Bot.partials);
