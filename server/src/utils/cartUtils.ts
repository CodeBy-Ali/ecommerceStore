import { ICartItem } from "../model/cartModel.ts";
import Product from "../model/productModel.ts";
import mongoose from "mongoose";
import logger from "../config/logger.ts";
import Cart from "../model/cartModel.ts";
import StoreSetting from "../model/settingsModel.ts";
import { ICart } from "../model/cartModel.ts";



export interface CartItemDetail{
  product: {
    _id: mongoose.Types.ObjectId;
    title: string,
    images: Array<string>,
    price: number,
    stock: number,
    slug: string,
} | null;
  quantity: number,
}

// add cart items product details
export const populateCartItems = async (cartItems: Array<ICartItem>):Promise<CartItemDetail[]> => {
  const products =  await Promise.all(
    cartItems.map(async ({productId,quantity})  => {
      try {
        return {
          product: await Product.findById(productId, { title: 1, slug: 1, images: 1, price: 1, stock: 1, _id: 1 }).lean().exec(),
          quantity: quantity,
        }
      }   catch (error) {
        console.log(`Error fetching product with ID: ${productId}`)
        return null;
      }
    })
  );
  return products.filter(product => product !== null);
}

// create user cart document
export function createCart(productId: mongoose.Types.ObjectId,quantity:number, userId: mongoose.Types.ObjectId| undefined): ICart {
  if (!userId) {
    throw new Error('Unauthorized access!. Received Request to create user cart with undefined userId');
  }
  return new Cart({
    userId: userId,
    items: [
      {
        productId,
        quantity,
      },
    ],
  });
}

export const getShippingConfig = async() => {
  const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' },{_id:0}).lean();
  if (!shippingConfig) {
    logger.error("Missing shipping Configuration document");
    throw new Error("Unable to find shipping Configuration document");
  }
  return shippingConfig;
}

