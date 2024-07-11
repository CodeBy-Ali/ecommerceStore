import config from "../config/config";
import {Request,Response} from 'express'
import { join } from "path";
import User from "../model/userModel";


interface CredentialsRequestBody{
  firstName: string,
  lastName: string,
  
}

// send register html page
export const sendRegisterPage = (req: Request, res: Response):void => {
  res.sendFile(join(config.dir.static,'src/pages/register.html'))
}

// send login html page
export const sendLoginPage = (req: Request, res: Response):void => {
  res.sendFile(join(config.dir.static,'src/pages/login.html'))
}

// add new user to database
const registerNewUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body; 
}