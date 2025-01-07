import App from "./app";
import config from "./config/index";
import { logger } from "./utils/logging";
import { DatabaseConfig } from "./config/db/DbConfig";
import Database from "./database/Database";
import redisCachingService from '@src/services/redis/RedisCachingService'

process.on("uncaughtException", error => {
  logger.error("Uncaught Exception: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection: ", reason);
});

const app = new App();
app.listen(config.application.port);
const dbConfig = new DatabaseConfig(config.database.uri, config.database.name);
const db = new Database(dbConfig);
db.connect();
const isRedisCachingWorking = async () => {
  await redisCachingService.isConnected();
}
isRedisCachingWorking()

