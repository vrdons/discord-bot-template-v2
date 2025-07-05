import { ColorResolvable, RGBTuple } from "discord.js";
import ms from "ms";
import mustache from "mustache";

import Paths from "@/config/Paths";
import { getJSON } from "@/utils/file";
import { isObject, parseColor } from "@/utils/utils";
export class EmojiHandler {
  private emojiList: Record<string, string> = {};
  private colorList: Record<string, number | RGBTuple> = {};
  interval: NodeJS.Timeout = setInterval(() => {
    this.sync();
  }, ms("1m"));
  constructor() {
    this.sync();
  }
  sync() {
    this.emojiList = getJSON(Paths.emojisPath) as Record<string, string>;
    this.colorList = getJSON(Paths.colorsPath) as Record<string, number | RGBTuple>;
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
