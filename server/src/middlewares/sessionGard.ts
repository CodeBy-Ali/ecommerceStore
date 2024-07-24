import { Request, Response,NextFunction } from "express";
import mongoose from 'mongoose';

export const initializeUserSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) return next();
  req.session.regenerate((err) => {
    if(err) next(err)
    req.session.user = {
      _id: new mongoose.Types.ObjectId(),
      isLoggedIn: false,
    };
    req.session.save((err) => {
      if (err) next(err);
      next();
    })
  })
} 

