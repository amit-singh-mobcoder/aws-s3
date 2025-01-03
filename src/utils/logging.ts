import { createLogger, format, transports, Logger, LoggerOptions } from "winston";
import { Format } from "logform";

export interface ILoggerService {
  log(level: string, message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  warn(message: string, metadata?: Record<string, any>): void;
  error(message: string, error?: Error): void;
}

export class LoggerService implements ILoggerService {
  private logger: Logger;

  constructor(options?: LoggerOptions) {
    const logFormat: Format = format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf(info => `[${info.timestamp}] (${info.level}): ${info.message}`),
    );

    this.logger = createLogger({
      level: "info",
      format: logFormat,
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), logFormat),
        }),
        new transports.File({ filename: "logs/error.log", level: "error" }),
        new transports.File({ filename: "logs/combined.log" }),
      ],
      exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
      ...options,
    });
  }

  public log(level: string, message: string, metadata?: Record<string, any>): void {
    this.logger.log({ level, message, ...metadata });
  }

  public info(message: string, metadata?: Record<string, any>): void {
    this.logger.info(message, metadata);
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    this.logger.warn(message, metadata);
  }

  public error(message: string, error?: Error): void {
    this.logger.error(message, { error: error?.stack || error });
  }
}

export class DefaultLogger extends LoggerService {
  private static instance: DefaultLogger;

  private constructor() {
    super();
  }

  public static getInstance(): DefaultLogger {
    if (!this.instance) {
      this.instance = new DefaultLogger();
    }
    return this.instance;
  }
}

export const logger = DefaultLogger.getInstance();
