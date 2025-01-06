import mongoose from "mongoose";
import { IDatabaseConfig } from "@src/config/db/DbConfig";
import { logger } from "@src/utils/logging";

interface IDatabase {
  connect(): Promise<typeof mongoose>;
  disconnect(): Promise<void>;
}

class Database implements IDatabase {
  private uri: string;
  private name: string;
  private connection: typeof mongoose | null = null;

  constructor(config: IDatabaseConfig) {
    this.uri = config.uri;
    this.name = config.name;
  }

  public async connect(): Promise<typeof mongoose> {
    try {
      const connectionInstance = await mongoose.connect(`${this.uri}/${this.name}`);
      logger.info(
        `Database connected successfully, DB-HOST: ${connectionInstance.connection.host}, DB-NAME: ${connectionInstance.connection.name}`,
      );
      this.connection = connectionInstance;
      return connectionInstance;
    } catch (error: any) {
      logger.error(`Error while connecting to the database: ${error.message}`, error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connection) {
      logger.warn("No database connection to disconnect");
      return;
    }

    try {
      await this.connection.disconnect();
      logger.info("Database disconnected successfully");
    } catch (error: any) {
      logger.error(`Error while disconnecting from the database: ${error.message}`, error);
    }
  }
}

export default Database;
