import compression from 'compression';
import express,{ Express } from "express";
import configManager from "../config/config.ts";
import pagesRoutes from '../routes/pageRoutes.ts';
import authRoutes from '../routes/authRoutes.ts';
import cartRoutes from '../routes/cartRoutes.ts';
import collectionRoutes from '../routes/collectionRoutes.ts';
import session, { Cookie } from 'express-session'
import MongoStore from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose';
import errorHandler from '../middlewares/errorHandler.ts';
import { MongoClient } from 'mongodb';
import unassignedRoutesHandler from '../middlewares/unassignedRoutes.ts';




//  config constants
const sessionName = configManager.getSessionConfig().name;
const sessionSecret = configManager.getSessionConfig().secret;
const databaseURI = configManager.getDatabaseConfig().URI;
const staticDir = configManager.getDirConfig().static;
const cookieMaxAge = configManager.getSessionConfig().cookieMaxAge;


 
// create app instance
const app: Express = express();

// add custom user property in sessionData interface
declare module 'express-session' {
  interface SessionData{
    user: {
      _id: mongoose.Types.ObjectId | string;
      isLoggedIn: boolean,
    }
  }
}

// crate client promise to reuse the mongo db connection;
const mongoClientPromise: Promise<MongoClient> = new Promise((resolve, reject) => {
  mongoose.connection.on('connected', () => {
    console.log("Connected to database ✔");
    const client: MongoClient | unknown = mongoose.connection.getClient();
    if(client) resolve(client as MongoClient);
  })
})

// initialize session
app.use(session({
  name: sessionName,
  secret: sessionSecret,
  store: MongoStore.create({
    clientPromise: mongoClientPromise
  }),
  saveUninitialized: false,
  resave: false,
  genid: () => uuidv4(),
  cookie: {
    maxAge: cookieMaxAge,
    httpOnly: false,
  },
}))
// set view engine
app.set('view engine', 'ejs');
app.set('views', configManager.getDirConfig().view);

// don't identify express
app.disable('x-powered-by');

// compress res body for response 
app.use(compression());

// parse req body of content application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

// parse req body of content json
app.use(express.json())


// serve static files
app.use(express.static(staticDir));

// assign routes 
app.use("/", pagesRoutes);
app.use("/account", authRoutes);
app.use("/collections", collectionRoutes);
app.use('/cart', cartRoutes);

// response to unhandled routes
app.all('*', unassignedRoutesHandler);

// handle uncaught errors
app.use(errorHandler)

export default app;