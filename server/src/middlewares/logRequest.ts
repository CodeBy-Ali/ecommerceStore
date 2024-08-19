import { Request,Response,NextFunction } from "express"
import logger from "../config/logger.ts";
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const status = res.statusCode;
  const color = getStatusColorCode(status);
  
  logger.info(`${req.method} ${req.url}  \x1b[1;${color}m%s\x1b[0m `,status);
  next();

}

function getStatusColorCode(status:number) {
  return status >= 500 ? 31 // green
    : status >= 400 ? 33 // yellow
      : status >= 300 ? 36 // cyan
        : status >= 200 ? 32 // green
          : 0; // no color
}



export default logRequest;  