import configManager from "./config/config.ts";
import app from "./app/app.ts"; 
import mongoose from "mongoose";
import logger from "./config/logger.ts";

const { host, port } = configManager.getServerConfig();
const databaseURI: string = configManager.getDatabaseConfig().URI;


// using async local storage for transactions
mongoose.set("transactionAsyncLocalStorage", true);

// connect to database and start the server
mongoose
  .connect(databaseURI)
  .then(() => {
    app.listen(port, host, () => {
      logger.info(`Server listening at http://127.0.0.1:${port}`);
    });
  })
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
 