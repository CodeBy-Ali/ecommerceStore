import configManager from "../config/config";
import {Request,Response} from 'express'
import { join } from "path";

// render home view
export const renderHomeView = (req: Request, res: Response) => {
  const user = req.session.user;
  res.render('home',{user});
}



