import { ICartItem } from "../model/cartModel.ts";
import Product from "../model/productModel.ts";
import mongoose from "mongoose";



export interface CartItemDetail{
  product: {
    _id: mongoose.Types.ObjectId;
    title: string,
    image: string,
    price: number,
    stock: number,
} | null;
  quantity: number,
}

export const populateCartItems = async (cartItems: Array<ICartItem>):Promise<CartItemDetail[]> => {
  const products =  await Promise.all(
    cartItems.map(async ({productId,quantity})  => {
      try {
        return {
          product: await Product.findById(productId, { title: 1, image: 1, price: 1, stock: 1, _id: 1 }).lean().exec(),
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



const newArray = [1, 2, 3, 4, 4].map(number => number * 2);