import dotenv, { configDotenv } from "dotenv";
import path from "path";

configDotenv();
dotenv.config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});
console.log(path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`));

interface IConfig {
  application: {
    port: number;
  };
  amazonS3: {
    awsBucketName: string;
    awsAccessKeyId: string;
    awsSercetAccessKey: string;
    awsBucketRegion: string;
  };
  database: {
    uri: string;
    name: string;
  };
}

class Config implements IConfig {
  public application: {
    port: number;
  };
  public amazonS3: {
    awsBucketName: string;
    awsAccessKeyId: string;
    awsSercetAccessKey: string;
    awsBucketRegion: string;
  };

  public database: {
    uri: string;
    name: string;
  };

  constructor() {
    this.application = {
      port: this.getNumber("PORT", 8080),
    };

    this.amazonS3 = {
      awsBucketName: this.getString("AWS_BUCKET_NAME"),
      awsAccessKeyId: this.getString("AWS_ACCESS_KEY_ID"),
      awsSercetAccessKey: this.getString("AWS_SECRET_ACCESS_KEY"),
      awsBucketRegion: this.getString("AWS_BUCKET_REGION"),
    };

    this.database = {
      uri: this.getString("DB_URI"),
      name: this.getString("DB_NAME"),
    };
  }

  private getNumber(envVal: string, defaultValue?: number): number {
    const value = process.env[envVal];
    if (value) return parseInt(value, 10);
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${envVal} not defined in environment.`);
  }

  private getString(envVal: string, defaultValue?: string): string {
    const value = process.env[envVal];
    if (value) return value;
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${envVal} not defined in environment.`);
  }
}

export default new Config();
