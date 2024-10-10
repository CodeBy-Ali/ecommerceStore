import mongoose from "mongoose";
import { UserSession } from "../app/app.ts";
import ShippingConfig, { IShippingConfig } from "../model/settingsModel.ts";
import User, { IUser, IUserDocument } from "../model/userModel.ts";
import { calculateProductSubtotal, getUserCart} from "./cartUtils.ts";
import configManager from "../config/config.ts";
import bcrypt from "bcrypt";
import { IRegisterRequestBody } from "../middlewares/validator.ts";
import { Request } from "express";
import { IProduct, IProductDocument } from "../model/productModel.ts";

interface IUserInfo extends UserSession {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}


export interface IPopulatedCartItem {
  product: IProductDocument,
  quantity: number,
}

export interface IPopulatedCart {
  _id: string|unknown;
  items: IPopulatedCartItem[]
  subTotal: number;
}

interface IUserConfig {
  user: IUserInfo | null;
  cart: IPopulatedCart | null;
  shippingConfig: IShippingConfig | null;
}

export const getUserConfig = async (
  userSession: UserSession | undefined
) => {
  const emptyConfig: IUserConfig = {
    user: null,
    cart: null,
    shippingConfig: null,
  };
  if (!userSession) return emptyConfig;

  const shippingConfig = await ShippingConfig.findOne({
    _id: "shipping_config",
  })
    .lean()
    .exec();
  const userInfo = userSession.isRegistered
    ? await User.findById(userSession._id, { passwordHash: 0, _id: 0 })
        .lean()
        .exec()
    : {};

  const cart = await getUserCart(userSession._id);
  if (!cart)
    return {
      cart: null,
      shippingConfig,
      user: {
        ...userSession,
        ...userInfo,
      },
    };

  const cartItems = cart.items  as IPopulatedCartItem[];
  const subTotal = calculateProductSubtotal(cartItems);
  return {
    user: {
      ...userSession,
      ...userInfo,
    },
    cart: {
      _id: cart._id.toString(),
      items: cartItems,
      subTotal,
    },
    shippingConfig,
  };
};

export async function createUniqueUser(
  userInfo: IRegisterRequestBody
): Promise<IUserDocument | null> {
  const { saltRounds } = configManager.getBcryptConfig();
  const passwordHash = await bcrypt.hash(userInfo.password, saltRounds);

  const duplicateUser = await User.findOne({ email: userInfo.email });

  if (duplicateUser) return null;

  const user = new User({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    passwordHash: passwordHash,
  });
  await user.save();
  return user;
}

export async function createUserSession(user: IUserDocument, req: Request) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) reject(err);

      req.session.user = {
        _id: user._id as mongoose.Types.ObjectId,
        isRegistered: true,
      };

      // req.session.isLoggedIn = true,
      req.session.save((err) => {
        if (err) reject(err);
        resolve(req.session.user);
      });
    });
  });
}
