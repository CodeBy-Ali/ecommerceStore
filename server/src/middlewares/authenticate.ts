import { Request, Response,NextFunction } from "express";

// checks if matching userId is present in the session store
export const isAuthenticated = (req: Request, res:Response, next:NextFunction) => {
  if (req.session.user)  next();
  res.redirect('/login')
}

export const redirectIfAuthorized = (req: Request, res:Response, next:NextFunction) => {
  if (!req.session.user) next();
  else res.redirect('/');
}