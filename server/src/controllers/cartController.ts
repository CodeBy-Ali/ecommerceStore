import { Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
import Cart from "../model/cartModel";
import Product from "../model/productModel";




export const addProductToCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  if (!productId) {
    res.status(400).json({ message: "ProductId is required" });
  }

  if (!req.session.user) return;

  try {
    const userId = req.session.user;
    const productObjectId = new mongoose.Types.ObjectId(productId)
    const userCart = await Cart.findOne({ userId: userId });
    if (!userCart) {
      const newUserCart = new Cart({
        userId: userId,
        items: [
          {
            productId: productObjectId, 
            quantity: 1           
          }
        ],
      });
      await newUserCart.save();
      return;
    }
    let itemFound = false;
    for (const item of userCart.items) {
      if (String(item.productId) === String(productObjectId)) {
        item.quantity++;
        itemFound = true;
      }
    }

    console.log(productObjectId)
    // if (!itemFound) {
    //   userCart.items.push({ productId: productObjectId, quantity: 1 });
    // }
    // userCart.updateOne({ $push: { items: productObjectId } });
    // console.log(userCart);
    // await Cart.findOneAndUpdate({ userId: userId }, { $push: { items: productObjectId } });
    const product = await Product.findById(productObjectId);
    res.status(201).json({ message: "success"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


