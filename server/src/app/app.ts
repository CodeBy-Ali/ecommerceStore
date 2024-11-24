import compression from "compression";
import express, { Express } from "express";
import config from "../config/config.ts";
import pagesRoutes from "../routes/pageRoutes.ts";
import cartRoutes from "../routes/cartRoutes.ts";
import orderRoutes from "../routes/orderRoutes.ts";
import productRoutes from "../routes/productRoutes.ts";
import collectionRoutes from "../routes/collectionRoutes.ts";
import accountRoutes from "../routes/accountRoutes.ts";
import apiTestRoutes from "../routes/testRoutes.ts";
import session, { Cookie } from "express-session";
import MongoStore from "connect-mongo";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import errorHandler from "../middlewares/errorHandler.ts";
import { MongoClient } from "mongodb";
import unassignedRoutesHandler from "../middlewares/unassignedRoutes.ts";
import logger from "../config/logger.ts";
import cors from "cors";
import logRequest from "../middlewares/logRequest.ts";

export interface UserSession {
  _id: mongoose.Types.ObjectId;
  isRegistered: boolean;
}

//  config constants
const sessionName = config.getSessionConfig().name;
const sessionSecret = config.getSessionConfig().secret;
const staticDir = config.getDirConfig().static;
const { cookieMaxAge } = config.getSessionConfig();

// create app instance
const app: Express = express();

// crate client promise to reuse the mongo db connection;
const mongoClientPromise: Promise<MongoClient> = new Promise(
  (resolve, reject) => {
    mongoose.connection.on("connected", () => {
      const client: MongoClient | unknown = mongoose.connection.getClient();
      if (client) resolve(client as MongoClient);
    });
  }
);

// add cors
app.use(
  cors({
    origin: config.getCorsConfig().origin,
    optionsSuccessStatus: 200,
  })
);

// initialize session
app.use(
  session({
    name: sessionName,
    secret: sessionSecret,
    store: MongoStore.create({
      clientPromise: mongoClientPromise,
    }),
    saveUninitialized: false,
    resave: false,
    genid: () => uuidv4(),
    cookie: {
      maxAge: cookieMaxAge,
      httpOnly: false,
    },
  })
);
// set view engine
app.set("view engine", "ejs");
app.set("views", config.getDirConfig().view);

// don't identify express
app.disable("x-powered-by");

// compress res body for response
app.use(compression());

// parse req body of content application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse req body of content json
app.use(express.json());

// serve static files
app.use(express.static(staticDir));

// log request urls
app.use(logRequest);

// assign routes
app.use("/", pagesRoutes);
app.use("/collections", collectionRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/account",accountRoutes);
app.use("/test", apiTestRoutes);
// response to unhandled routes
app.all("*", unassignedRoutesHandler);

// handle uncaught errors
app.use(errorHandler);

export default app;
