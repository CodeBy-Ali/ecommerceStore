import configManager from "./config/config.ts";
import app from "./app/app.ts";
import mongoose from "mongoose";
import logger from "./config/logger.ts";
import { url } from "inspector";
import setApiTestRequestInterval from "./config/testRequest.ts";

const { host, port } = configManager.getServerConfig();
const { URI, name } = configManager.getDatabaseConfig();
const { env } = configManager.getEnvConfig();
// using async local storage for transactions
mongoose.set("transactionAsyncLocalStorage", true);

// connect to database and start the server
mongoose
  .connect(URI, {
    dbName: name,
  })
  .then(() => {
    logger.info(`[---------------- ENV: ${env} -------------------]`);
    logger.info("Connected to database ✔");
    app.listen(port, host, () => {
      logger.info(`Server listening at http://127.0.0.1:${port}`);
    });
    setApiTestRequestInterval();
  })
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
