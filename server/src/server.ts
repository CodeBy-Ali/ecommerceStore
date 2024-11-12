import configManager from "./config/config.ts";
import app from "./app/app.ts";
import mongoose from "mongoose";
import logger from "./config/logger.ts";
import { url } from "inspector";

const { host, port } = configManager.getServerConfig();
const { URI, name } = configManager.getDatabaseConfig();

// using async local storage for transactions
mongoose.set("transactionAsyncLocalStorage", true);

// connect to database and start the server
mongoose
  .connect(URI, {
    dbName: name,
  })
  .then(() => {
    app.listen(port, host, () => {
      logger.info(`Server listening at http://127.0.0.1:${port}`);
    });
  })
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
