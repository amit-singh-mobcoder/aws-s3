import config from "@src/config";

export interface IRedisConfig {
  host: string;
  port: number;
  password: string;
}

export interface IRedisConfigProvider {
  getConfig(): IRedisConfig;
}

export class RedisConfigProvider implements IRedisConfigProvider {
  getConfig(): IRedisConfig {
    return {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.pass,
    };
  }
}
