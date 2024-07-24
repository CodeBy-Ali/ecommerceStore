import { Request, Response,NextFunction } from "express";

// checks if matching userId is present in the session store
export const protectRoute = (req: Request, res:Response, next:NextFunction) => {
  if (req.session.user)  next();
  else res.redirect('/login')
}

export const isAuthorized = (req: Request, res:Response, next:NextFunction) => {
  if (req.session.user)  next();
  else res.status(401).json({ message: "Unauthorized access. Please log in to continue" });
}

export const redirectIfAuthorized = (req: Request, res:Response, next:NextFunction) => {
  if (!req.session.user) next();
  else res.redirect('/');
} 