import { Request,Response,NextFunction,} from "express"
import logger from "../config/logger.ts";
const errorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
  logger.error(err)
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  if  (req.accepts('html')) {
    res.render('error', { error: err });
  }else if (req.accepts('application/json, json')) {
    res.json({
      status: "error",
      message:"Internal Server Error"
    });

  }else res.send(`Oh no, Something went wrong!`)
}

export default errorHandler;