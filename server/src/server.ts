import configManager from "./config/config.ts";
import app from "./app/app.ts"; 
import mongoose from "mongoose";

const { host, port } = configManager.getServerConfig();
const databaseURI: string = configManager.getDatabaseConfig().URI;

// connect to database and start the server
mongoose
  .connect(databaseURI)
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Server listening at http://${host}:${port}`);
    });
  })
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
 