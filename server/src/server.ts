import configManager from "./config/config.ts";
import app from "./app/app.ts"; 
import mongoose from "mongoose";
import logger from "./config/logger.ts";

const { host, port } = configManager.getServerConfig();
const databaseURI: string = configManager.getDatabaseConfig().URI;

// connect to database and start the server
mongoose
  .connect(databaseURI)
  .then(() => {
    app.listen(port, host, () => {
      logger.info(`Server listening at http://${host}:${port}`);
    });
  })
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
 