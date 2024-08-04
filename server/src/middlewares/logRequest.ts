import { Request,Response,NextFunction } from "express"
import logger from "../config/logger.ts"
const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Request Received for %s",req.url);
  next();
}
export default logRequest;  