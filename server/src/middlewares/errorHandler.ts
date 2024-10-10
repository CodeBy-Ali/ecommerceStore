import { Request,Response,NextFunction,} from "express"
import logger from "../config/logger.ts";



export interface ApiError extends Error{
  status: string,
  code: number,
}


const errorHandler = (err: Error|ApiError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (isApiError(err)) {
    res.status(err.code).json({
      status: err.status,
      message: err.message,
    })
    return;
  }

  logger.error(err);
  if  (req.accepts('html')) {
    res.render('error', { error: err });
  }else if (req.accepts('application/json, json')) {
    res.json({
      status: "error",
      message:"Internal Server Error"
    });
  }else res.send(`Oh no, Something went wrong!`)
}



export function createError(code: number, message: string, status: string):ApiError {
  const apiError = new Error(message) as ApiError;
  apiError.status = status;
  apiError.code = code;
  return apiError;
}

function isApiError(error: ApiError | Error) {
  return "status" in error && "code" in error;
}

export default errorHandler;