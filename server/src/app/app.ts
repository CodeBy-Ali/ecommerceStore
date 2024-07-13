import compression from 'compression';
import express,{ Express, Request, Response } from "express";
import configManager from "../config/config";
import pagesRoutes from '../routes/pageRoutes';
import authRoutes from '../routes/authRoutes';
import collectionRoutes from '../routes/collectionRoutes';
import session, { Cookie } from 'express-session'
import MongoStore from 'connect-mongo';
import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose';


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
      _id: mongoose.Types.ObjectId;
    }
  }
}

// initialize session
app.use(session({
  name: sessionName,
  secret: sessionSecret,
  store: MongoStore.create({
    mongoUrl: databaseURI,
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


app.use("/", pagesRoutes);
app.use("/account", authRoutes);
app.use("/collections", collectionRoutes);

export default app;