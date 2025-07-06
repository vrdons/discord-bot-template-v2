import path from "path";

import { extendPaths, Paths } from "@/types/settings";
export const ePaths = {
  rootPath: path.join(process.cwd(), "src"),
  commandsPath: path.join(process.cwd(), "src", "commands")
} as extendPaths;

export default {
  eventsPath: path.join(ePaths.rootPath, "events"),
  prefixCommandsPath: path.join(ePaths.commandsPath, "prefix"),
  slashCommandsPath: path.join(ePaths.commandsPath, "slash"),
  contextMenusPath: path.join(ePaths.commandsPath, "context"),
  localesPath: path.join(ePaths.rootPath, "locales"),
  emojisPath: path.join(ePaths.rootPath, "emojis.json"),
  colorsPath: path.join(ePaths.rootPath, "colors.json"),
  databaseModelsPath: path.join(ePaths.rootPath, "models")
} as Paths;
