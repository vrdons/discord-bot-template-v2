import { ClientEvents } from "discord.js";

import { MaybePromise } from "@/types/include";

import { DefaultOptions } from "./default";

export type EventHandlerOptions<K extends keyof ClientEvents> = {
  name: K;
  once: boolean;
  handle: (options: DefaultOptions, ...args: ClientEvents[K]) => MaybePromise<any>;
};
export function EventHandler<K extends keyof ClientEvents>(options: EventHandlerOptions<K>) {
  return options;
}
