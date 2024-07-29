import { ICartItem } from "../model/cartModel.ts";
import Product from "../model/productModel.ts";

export const populateCartItems = async (cartItems: Array<ICartItem>) =>{
  const products =  await Promise.all(
    cartItems.map(async ({productId,quantity})  => {
      try {
        return {
          product: await Product.findById(productId, { title: 1, image: 1, price: 1, stock: 1, _id: 1 }).lean(),
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