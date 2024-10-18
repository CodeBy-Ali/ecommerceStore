import configManager from "../config/config.ts";
import { Request, Response, NextFunction } from "express";
import User from "../model/userModel.ts";
import bcrypt from "bcrypt";
import Cart, { ICart } from "../model/cartModel.ts";
import mongoose from "mongoose";
import { createUniqueUser, createUserSession, getUserConfig } from "../utils/userUtils.ts";
import { ILoginRequestBody, IRegisterRequestBody } from "../middlewares/validator.ts";
import { userInfo } from "os";

type ObjectId = mongoose.Types.ObjectId;



export const renderAuthView = async (viewName: string,req:Request, res:Response, next:NextFunction) => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    res.render(viewName, userConfig);
  } catch (error) {
    next(error)
  }
}


// add new user to database
export const registerNewUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {returnTo,...userInfo} = req.body as IRegisterRequestBody;
  try {
    
    const { user ,unique} = await createUniqueUser(userInfo);
    if (!unique) {
      res.status(400).json({
        status: "fail",
        message: "Email already Registered"
      });
      return;
    }
    // assign the cart of anonymous user to the registered user.
    if (req.session.user) {
      await Cart.findOneAndUpdate({ userId: req.session.user._id }, { userId: user?._id });
    }
    // create new user session
    await createUserSession(user, req);
    res.redirect(returnTo || '/');
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password ,returnTo} = req.body as ILoginRequestBody;
  try {
    // check if user with current email already exist in db
    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      res.status(404).json({
        status: "fail",
        message: "We couldn't find an account with that email address"
      });
      return;
    }
    // compare the password
    const isPasswordCorrect: boolean = await bcrypt.compare(password, registeredUser.passwordHash);
    if (!isPasswordCorrect) {
      res.status(401).json({
        status: "fail",
        message: "Incorrect password"
      });
      return;
    }

    const userSession = req.session.user;
    if (userSession) {
      await mergeAnonymousCartWithRegisteredUser(userSession._id,registeredUser._id as mongoose.Types.ObjectId);
    }
    
    await createUserSession(registeredUser, req);
    res.redirect(returnTo || "/");
  } catch (error) {
    next(error);
  }
};



// TODO refactor inner if/else conditions and inner loops
async function mergeAnonymousCartWithRegisteredUser(anonymousUserId:ObjectId,registeredUserId:ObjectId) {
  const session = await mongoose.startSession()
  session.startTransaction();
  try {
    const anonymousUserCart = await Cart.findOne({ userId: anonymousUserId }).session(session);
    const registeredUserCart = await Cart.findOne({ userId: registeredUserId }).session(session);
  
    if (!registeredUserCart && anonymousUserCart) {
      anonymousUserCart.userId = registeredUserId;  
      await anonymousUserCart.save({session});
    
    } else if (registeredUserCart && anonymousUserCart) {
      anonymousUserCart.items.forEach(item => {
        const duplicateItem = registeredUserCart.items.find(cartItem => {
          if (
            cartItem.product instanceof mongoose.Types.ObjectId &&
            item.product instanceof mongoose.Types.ObjectId
          ) {
            return (cartItem.product).equals(item.product)
          }
          return false;
        });
        if (duplicateItem) duplicateItem.quantity += item.quantity;
        else registeredUserCart.items.push(item);
      })
      await registeredUserCart.save({session});
      await Cart.deleteOne({ userId: anonymousUserId },{session});
    }
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession()   
  }
}