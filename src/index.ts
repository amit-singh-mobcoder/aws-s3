import App from "./app";
import config from "./config/index";
import { logger } from "./utils/logging";

process.on("uncaughtException", error => {
  logger.error("Uncaught Exception: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection: ", reason);
});

const app = new App();
app.listen(config.application.port);
