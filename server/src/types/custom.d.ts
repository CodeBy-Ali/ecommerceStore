import { UserSession } from "../app/app.ts";
import mongoose from "mongoose";

// add custom user property in sessionData interface
declare module 'express-session' {
  interface SessionData{
    user: UserSession;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    shippingAddress?: mongoose.Types.ObjectId 
  }
}
