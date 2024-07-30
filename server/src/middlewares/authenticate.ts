import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.ts";

// checks if matching userId is present in the session store
export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) next();
  else res.redirect("/login");
};

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) next();
  else res.status(401).json({ message: "Unauthorized access. Please log in to continue" });
};

export const redirectIfRegistered = (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user;
  logger.info("Checking registration for User", req.session.user);
  if (!user || !user.isRegistered) {
    logger.info("Moving the request for non registered User for authentication", req.session.user);
    next();
  } else {
    logger.info("Redirecting registered User to home", req.session.user);
    res.redirect("/");
  }
};
