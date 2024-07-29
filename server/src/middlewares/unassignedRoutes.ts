import { Request,Response,NextFunction,} from "express"

const unassignedRoutesHandler = (req:Request, res:Response, next:NextFunction) => {
  res.status(404);
  if  (req.accepts('html')) {
    res.render('error', { error: '404 not Found' });
  }else if (req.accepts(['application/json' ,'json'])) {
    res.json({ message: `${req.originalUrl} not found` });
  }else res.send(`404 not Found`)
}

export default unassignedRoutesHandler;