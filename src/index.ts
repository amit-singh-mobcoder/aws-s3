import App from "./app";
import config from "./config/index";
import { logger } from "./utils/logging";
import { DatabaseConfig } from "./config/db/DbConfig";
import Database from "./database/Database";
import redisCachingService from "@src/services/redis/RedisCachingService";
class AppBootstrapper {
  private app: App;
  private db: Database;

  constructor() {
    this.app = new App();
    const dbConfig = new DatabaseConfig(config.database.uri, config.database.name);
    this.db = new Database(dbConfig);
  }

  public async start(): Promise<void> {
    try {
      await this.initializeDatabase();
      await this.initializeRedis();
      this.app.listen(config.application.port);
    } catch (error: any) {
      logger.error("Application startup failed: ", error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  private async initializeDatabase(): Promise<void> {
    try {
      await this.db.connect();
    } catch (error) {
      throw error;
    }
  }
  private async initializeRedis(): Promise<void> {
    try {
      await redisCachingService.isConnected();
      logger.info("Redis caching is now ready to use");
    } catch (error) {
      throw error;
    }
  }
}

process.on("uncaughtException", error => {
  logger.error("Uncaught Exception: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection: ", reason);
});

const bootstrapper = new AppBootstrapper();
bootstrapper.start();
