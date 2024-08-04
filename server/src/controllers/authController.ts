import configManager from "../config/config.ts";
import { Request, Response, NextFunction } from "express";
import User from "../model/userModel.ts";
import bcrypt from "bcrypt";
import Cart, { ICart } from "../model/cartModel.ts";
import mongoose from "mongoose";
import { getUserConfig } from "../utils/userUtils.ts";

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
  const { firstName, lastName, email, password } = req.body;
  try {
    const duplicateUser = await User.findOne({ email: email });
    if (duplicateUser) {
      res.status(400).json({ message: "Email already Registered" });
      return;
    }

    const { saltRounds } = configManager.getBcryptConfig();
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      passwordHash: passwordHash,
    });
    await user.save();

    // assign the cart of anonymous user to the registered user.
    if (req.session.user) {
      await Cart.findOneAndUpdate({ userId: req.session.user._id }, { userId: user?._id });
    }

    // create new user session
    req.session.regenerate((err) => {
      if (err) next(err);

      req.session.user = {
        _id: user._id,
        isRegistered: true,
      };

      // req.session.isLoggedIn = true,
      req.session.save((err) => {
        if (err) next(err);
        res.redirect("/");
      });
    });
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  try {
    // check if user with current email already exist in db
    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      res.status(404).json({ message: "We couldn't find an account with that email address" });
      return;
    }
    // compare the password
    const isPasswordCorrect: boolean = await bcrypt.compare(password, registeredUser.passwordHash);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const userSession = req.session.user;
    if (userSession) {
      await mergeAnonymousCartWithRegisteredUser(userSession._id,registeredUser._id);
    }
    
    req.session.regenerate((err) => {
      if (err) next(err);
      req.session.user = {
        _id: registeredUser._id,
        isRegistered: true,
      }

      req.session.save((err) => {
        if (err) next(err);
        res.redirect("/");
      })
    })
  } catch (error) {
    next(error);
  }
};



async function mergeAnonymousCartWithRegisteredUser(anonymousUserId:ObjectId,registeredUserId:ObjectId) {
  const session = await mongoose.startSession()
  session.startTransaction();
  try {
    const anonymousUserCart = await Cart.findOne({ userId: anonymousUserId}).session(session);
    const registeredUserCart = await Cart.findOne({ userId: registeredUserId }).session(session);
  
    if (!registeredUserCart && anonymousUserCart) {
      anonymousUserCart.userId = registeredUserId;  
      await anonymousUserCart.save({session});
    
    } else if (registeredUserCart && anonymousUserCart) {
      anonymousUserCart.items.forEach(item => {
        const duplicateItem = registeredUserCart.items.find(cartItem => (cartItem.productId).equals(item.productId));
        if (duplicateItem) duplicateItem.quantity += item.quantity;
        else registeredUserCart.items.push(item);
      })
      await registeredUserCart.save({session});
      await Cart.deleteOne({ userId: anonymousUserId },{session});
    }
    session.commitTransaction();
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession()   
  }
}