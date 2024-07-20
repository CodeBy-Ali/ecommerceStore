import { Request, Response } from "express";
import mongoose from "mongoose";
import Cart,{ICart} from "../model/cartModel.ts";
import Product from "../model/productModel.ts";
import { populateCartItems } from "../utils/utils.ts";
type ObjectId = mongoose.Types.ObjectId;


export const addProductToCart = async (req: Request, res: Response) => {
  const { productPubId } = req.body;
  if (!productPubId) {
    return res.status(400).json({ message: "ProductId is required" });
  }

  if (!req.session.user) {
    return res.status(401).json({message: "Login required to add products to cart"})
  };

  try {
    const userId = req.session.user as ObjectId;
    const product = await Product.findOne({ pubId: productPubId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const productId = product?._id;
    const cart = await Cart.findOne({ userId: userId });

    // create new cart if not already present
    if (!cart) {
      const newCart = createCart(productId,userId);
      await newCart.save();
      const cartProducts = await populateCartItems(newCart.items);
      return res.status(201).json({ cartItems: cartProducts});
    }

    // increase the quantity if item is already present in cart else add the item
    const cartItem = cart.items.find((item) => item.productId.equals(productId));
    if (cartItem) cartItem.quantity++;
    else cart.items.push({ productId: productId, quantity: 1 });
    await cart.save();
    
    // store all cart item detail objects in array
    const cartProducts = await populateCartItems(cart.items);
    res.status(201).json({ cartItems: cartProducts});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


function createCart(productId:ObjectId, userId:ObjectId):ICart {
  return new Cart({
    userId: userId,
    items: [
      {
        productId: productId,
        quantity: 1
      }
    ]
  })
} 

