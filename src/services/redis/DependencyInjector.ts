import { RedisConnectionManager } from "./RedisConnectionManager";
import { DefaultRedisConnectionListener } from "./RedisConnectionManager";
import { RedisConfigProvider } from "@src/config/redis/RedisConfig";
import { RedisCachingService } from "./RedisCachingService";

export const createRedisCachingService = () => {
  const redisConfigProvider = new RedisConfigProvider();
  const redisConfig = redisConfigProvider.getConfig();
  const listener = new DefaultRedisConnectionListener();
  const redisConnectionManager = new RedisConnectionManager(redisConfig, listener);
  return new RedisCachingService(redisConnectionManager);
};
