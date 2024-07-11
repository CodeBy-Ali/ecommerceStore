import config from "../config/config";
import {Request,Response} from 'express'
import { join } from "path";

// render home view
export const renderHomeView = (req: Request, res: Response) => {
  res.sendFile(join(config.dir.static,'index.html'))
}



