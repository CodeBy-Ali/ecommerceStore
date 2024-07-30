import configManager from "../config/config.ts";
import {NextFunction, Request,Response} from 'express'
import Cart, { ICart } from "../model/cartModel.ts";
import { populateCartItems } from "../utils/utils.ts";
import { Document } from "mongoose";
import StoreSetting from "../model/settingsModel.ts";

// render home view
export const renderHomeView = async(req: Request, res: Response,next:NextFunction) => {
  const user = req.session.user;
  try {
    const cart = await Cart.findOne({ userId: user }).lean();
    const cartItems = cart ? await populateCartItems(cart.items) : []; 
    const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' }).lean();
    if (!shippingConfig) throw new Error('shipping_config document not found');
    res.render('home', {
      user,
      cartItems,
      'storeSettings': shippingConfig,
    });
  } catch(error) {
    next(error)
  }
}

