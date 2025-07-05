import path from "path";
export const commandsPath = path.join(process.cwd(), "src", "commands");

const Paths = {
  eventsPath: path.join(process.cwd(), "src", "events"),
  prefixCommandsPath: path.join(commandsPath, "prefix"),
  slashCommandsPath: path.join(commandsPath, "slash"),
  contextMenusPath: path.join(commandsPath, "context"),
  languagePath: path.join(process.cwd(), "src", "locales"),
  emojisPath: path.join(process.cwd(), "src", "emojis.json"),
  colorsPath: path.join(process.cwd(), "src", "colors.json"),
  databaseModelsPath: path.join(process.cwd(), "src", "models")
};

export default Paths;
