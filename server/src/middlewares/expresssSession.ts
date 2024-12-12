import MongoStore from "connect-mongo";
import session, { SessionOptions } from "express-session";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config.ts";

export interface UserSession {
  _id: mongoose.Types.ObjectId;
  isRegistered: boolean;
}
// crate client promise to reuse the mongo db connection;
const mongoClientPromise: Promise<MongoClient> = new Promise(
  (resolve, reject) => {
    mongoose.connection.on("connected", () => {
      const client: MongoClient | unknown = mongoose.connection.getClient();
      if (client) resolve(client as MongoClient);
    });
  }
);

function getSessionConfig(): SessionOptions {
  const sessionName = config.getSessionConfig().name;
  const sessionSecret = config.getSessionConfig().secret;
  const { cookieMaxAge } = config.getSessionConfig();
  const { isProduction } = config.getEnvConfig();

  return {
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
      httpOnly: isProduction,
      sameSite: isProduction,
      secure: isProduction,
    },
  };
}

const sessionMiddleware = session(getSessionConfig());
export default sessionMiddleware;
