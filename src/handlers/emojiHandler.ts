import { ColorResolvable, RGBTuple } from "discord.js";
import ms from "ms";
import mustache from "mustache";

import { getJSON } from "@/utils/file";
import { isObject } from "@/utils/utils";
import { Client } from "@/classes/Bot";
import { Paths } from "@/types/settings";
export class EmojiHandler {
  private emojiList: Record<string, string> = {};
  private colorList: Record<string, number | RGBTuple> = {};
  interval: NodeJS.Timeout = setInterval(() => {
    this.sync();
  }, ms("1m"));
  constructor(
    private _bot: Client,
    private paths: Paths
  ) {
    this.sync();
  }
  sync() {
    this.emojiList = getJSON(this.paths.emojisPath) as Record<string, string>;
    this.colorList = getJSON(this.paths.colorsPath) as Record<string, number | RGBTuple>;
  }
  _e(...args: string[]): string | undefined {
    const text = mustache.render(`{{{${args.join(".")}}}}`, this.emojiList);
    if (!text || text === args.join(".") || isObject(text)) return undefined;
    return text;
  }
  _c(...args: string[]): number | RGBTuple | ColorResolvable | null {
    const text = mustache.render(`{{${args.join(".")}}}`, this.colorList);
    if (!text || text === args.join(".") || isObject(text)) return null;
    else if (typeof text == "string") {
      return parseColor(text) as number | RGBTuple;
    } else return text;
  }
  putEmoji(text: string) {
    return mustache.render(text, this.emojiList, {}, { tags: ["[[", "]]"] });
  }
}
export function parseColor(input: string | number[]): number[] | undefined | number {
  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input === "string" && input.includes(",")) {
    return input.split(",").map((item) => Number(item.trim()));
  }

  if (typeof input === "string") {
    const num = Number(input.trim());
    return isNaN(num) ? undefined : num;
  }

  return undefined;
}
