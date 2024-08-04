import {NextFunction, Request,Response} from 'express'
import { getUserConfig } from "../utils/userUtils.ts";

// render home view
export const renderHomeView = async(req: Request, res: Response,next:NextFunction) => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    res.render('home', userConfig);
  } catch(error) {
    next(error)
  }
}


