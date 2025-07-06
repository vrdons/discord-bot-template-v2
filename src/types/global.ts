export {};
export type MaybePromise<T> = T | Promise<T>;
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST?: string;
      DB_PORT?: string;
      DB_USER?: string;
      DB_PASSWORD?: string;
      DB_NAME?: string;
      SHARDING_MANAGER?: string;
      SHARDS?: string;
      SHARD_COUNT?: string | "auto";
      DISCORD_TOKEN?: string;
      [key: string]: string | undefined;
    }
  }
}
