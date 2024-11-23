import { Request,Response,NextFunction,} from "express"
import { getUserConfig } from "../utils/userUtils.ts";

const unassignedRoutesHandler = async (req:Request, res:Response, next:NextFunction) => {
  const userSession = req.session.user;
  const userConfig = await getUserConfig(userSession);
  res.status(404);
  if  (req.accepts('html')) {
    res.render('notFound', userConfig);
  }else if (req.accepts(['application/json' ,'json'])) {
    res.json({
      status: 'fail',
      message: `${req.originalUrl} not found`
    });
  }else res.send(`404 not Found`)
}

export default unassignedRoutesHandler;