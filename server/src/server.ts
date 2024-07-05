import config from "./config/config";
import app from "./app/app";
import mongoose from "mongoose";

const { host, port, databaseURI } = config;


// connect to database and start the server
mongoose.connect(databaseURI)
.then(() => {
  console.log('Connected to database');
  app.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}`)
  });
}).catch((error:any) => {
  console.log(error);
  process.exit(1);
})



 