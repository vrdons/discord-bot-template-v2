import { ClientEvents } from "discord.js";

import { MaybePromise } from "@/types/global";
import { DefaultOptions } from "@/types/options/default";

export type EventHandlerOptions<K extends keyof ClientEvents> = {
  name: K;
  once: boolean;
  handle: (options: DefaultOptions, ...args: ClientEvents[K]) => MaybePromise<any>;
};
