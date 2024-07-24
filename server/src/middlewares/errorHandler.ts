import { Request,Response,NextFunction,} from "express"

const errorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
  console.log(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  if  (req.accepts('html')) {
    res.render('error', { error: err });
  }else if (req.accepts('application/json, json')) {
    res.json({ message: "Internal Server Error" });
  }else res.send(`Oh no, Something went wrong!`)
}

export default errorHandler;