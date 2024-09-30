import mongoose from "mongoose";
import { UserSession } from "../app/app.ts";
import Cart from "../model/cartModel.ts";
import ShippingConfig, { IShippingConfig } from "../model/settingsModel.ts";
import User, { IUser } from "../model/userModel.ts";
import { populateCartItems } from "./cartUtils.ts";
import { CartItemDetail } from "./cartUtils.ts";



interface IUserInfo extends UserSession{
  firstName?: string,
  lastName?: string,
  email?: string,
  avatar?: string,
}


interface IPopulatedCart{
  _id: string;
  items: CartItemDetail[],
  subTotal: number,
}

interface IUserConfig {
  user: IUserInfo | null;
  cart: IPopulatedCart | null;
  shippingConfig: IShippingConfig | null;
}

export const getUserConfig = async (userSession: UserSession | undefined): Promise<IUserConfig> => {
  const emptyConfig: IUserConfig = {
    user: null,
    cart: null,
    shippingConfig: null,
  } 
  if (!userSession) return emptyConfig ;

  const shippingConfig = await ShippingConfig.findOne({ _id: "shipping_config" }).lean().exec();
  const userInfo = userSession.isRegistered ?
  await User.findById(userSession._id, { "passwordHash": 0 ,"_id": 0}).lean().exec() :
  {};
  
  const cart = await Cart.findOne({ userId: userSession._id }).lean().exec();
  if (!cart) return {
    cart: null,
    shippingConfig,
    user: {
      ...userSession,
      ...userInfo,
    }
  };
  
  const cartItems = cart ? await populateCartItems(cart.items) : [];
  
  const subTotal = Number(
    cartItems
      .reduce((subTotal, { quantity, product }) => {
        return (subTotal += product ? product.price * quantity : 0);
      }, 0)
      .toFixed(2)
  );
  return {
    user: {
      ...userSession,
      ...userInfo
    },
    cart: {
      _id: cart._id.toString(),
      items: cartItems,
      subTotal,
    },
    shippingConfig,
  };
};
