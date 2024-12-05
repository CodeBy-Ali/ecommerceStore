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
import errorHandler from "../middlewares/errorHandler.ts";
import unassignedRoutesHandler from "../middlewares/unassignedRoutes.ts";
import cors from "cors";
import logRequest from "../middlewares/logRequest.ts";
import sessionMiddleware from "../middlewares/expresssSession.ts";

//  config constants
const staticDir = config.getDirConfig().static;

// create app instance
const app: Express = express();

// add cors
app.use(
  cors({
    origin: config.getCorsConfig().origin,
    optionsSuccessStatus: 200,
  })
);

// initialize session
app.use(sessionMiddleware);

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
app.use("/account", accountRoutes);
app.use("/test", apiTestRoutes);
// response to unhandled routes
app.all("*", unassignedRoutesHandler);

// handle uncaught errors
app.use(errorHandler);

export default app;
