import Redis from "ioredis";
import { logger } from "@src/utils/logging";
import { IRedisConnectionManager } from "./RedisConnectionManager";
import { createRedisCachingService } from "./DependencyInjector";

export interface IRedisCachingService {
  set(key: string, value: string, ttl?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  isConnected(): Promise<boolean>;
}

export class RedisCachingService implements IRedisCachingService {
  private redisClient: Redis;

  constructor(connectionManager: IRedisConnectionManager) {
    this.redisClient = connectionManager.getClient();
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!key || typeof key !== "string") throw new Error("Invalid key provided for caching.");
    try {
      if (ttl) {
        await this.redisClient.set(key, value, "EX", ttl);
      } else {
        await this.redisClient.set(key, value);
      }
      logger.info(`Key "${key}" set in cache${ttl ? ` with TTL ${ttl}s` : ""}.`);
    } catch (err) {
      logger.error(`Error setting key "${key}" in cache: ${err}`);
      throw err;
    }
  }

  public async get(key: string): Promise<string | null> {
    if (!key || typeof key !== "string") {
      throw new Error("Invalid key provided for fetching from cache.");
    }
    try {
      const value = await this.redisClient.get(key);
      logger.info(`Key "${key}" fetched from cache: ${value ? "Hit" : "Miss"}`);
      return value;
    } catch (err) {
      logger.error(`Error fetching key "${key}" from cache: ${err}`);
      throw err;
    }
  }

  public async delete(key: string): Promise<void> {
    if (!key || typeof key !== "string") {
      throw new Error("Invalid key provided for deletion from cache.");
    }
    try {
      await this.redisClient.del(key);
      logger.info(`Key "${key}" deleted from cache.`);
    } catch (err) {
      logger.error(`Error deleting key "${key}" from cache: ${err}`);
      throw err;
    }
  }

  public async isConnected(): Promise<boolean> {
    try {
      await this.redisClient.ping();
      return true;
    } catch {
      return false;
    }
  }
}


export default createRedisCachingService();
