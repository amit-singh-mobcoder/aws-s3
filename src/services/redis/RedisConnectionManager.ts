import Redis from "ioredis";
import { logger } from "@src/utils/logging";
import { IRedisConfig } from "@src/config/redis/RedisConfig";

interface IRedisConnectionListener {
  onConnect(): void;
  onError(err: Error): void;
}

export interface IRedisConnectionManager {
  getClient(): Redis;
}

export class DefaultRedisConnectionListener implements IRedisConnectionListener {
  onConnect(): void {
    logger.info(`Redis connected successfully`);
  }

  onError(err: Error): void {
    logger.error(`Redis connection error : ${err.message} : stack : ${err.stack}`);
  }
}

export class RedisConnectionManager implements IRedisConnectionManager {
  public redis: Redis;

  constructor(redisConfig: IRedisConfig, listener: IRedisConnectionListener) {
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    });

    this.initializeListeners(listener);
  }

  private initializeListeners(listener: IRedisConnectionListener) {
    this.redis.on("connect", () => listener.onConnect());
    this.redis.on("error", err => listener.onError(err));
  }

  getClient(): Redis {
    return this.redis;
  }
}
