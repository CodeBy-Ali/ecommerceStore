import { ICartItem } from "../model/cartModel.ts";
import Product, { IProduct } from "../model/productModel.ts";
import mongoose from "mongoose";
import logger from "../config/logger.ts";
import Cart from "../model/cartModel.ts";
import ShippingConfig from "../model/settingsModel.ts";
import { ICart } from "../model/cartModel.ts";
import config from "../config/config.ts";
import { IPopulatedCart, IPopulatedCartItem } from "./userUtils.ts";





export async function getUserCart(userId: mongoose.Types.ObjectId | undefined) {
  return await Cart.findOne({ userId: userId }).populate({path: "items",populate: "product"}).lean().exec();
}



// create user cart document
export function createCart(
  productId: mongoose.Types.ObjectId,
  quantity: number,
  userId: mongoose.Types.ObjectId | undefined
): ICart {
  if (!userId) {
    throw new Error(
      "Unauthorized access!. Received Request to create user cart with undefined userId"
    );
  }
  return new Cart({
    userId: userId,
    items: [
      {
        product: productId,
        quantity,
      },
    ],
  });
}

export const getShippingConfig = async () => {
  const shippingConfig = await ShippingConfig.findOne(
    { _id: "shipping_config" },
    { _id: 0 }
  )
    .lean()
    .exec();
  if (!shippingConfig) {
    logger.error("Missing shipping Configuration document");
    throw new Error("Unable to find shipping Configuration document");
  }
  return shippingConfig;
};

export function calculateProductSubtotal(cartItems: IPopulatedCartItem[]): any {
  const subTotal = cartItems
    .reduce((subTotal, { quantity, product }) => {
      return (subTotal += product ? product.price * quantity : 0);
    }, 0)
    .toFixed(2);
  return parseInt(subTotal);
}
