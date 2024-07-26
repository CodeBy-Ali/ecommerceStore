import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Cart, { ICart, ICartItem } from "../model/cartModel.ts";
import Product from "../model/productModel.ts";
import { populateCartItems } from "../utils/utils.ts";
type ObjectId = mongoose.Types.ObjectId;

export const deleteItem = async (req: Request, res: Response,next:NextFunction) => {
  const { id } = req.params;

  try {
    const userId = req.session?.user?._id;

    const updatedResult = await Cart.updateOne({ userId: userId }, { $pull: { items: { productId: id } } });
    if (updatedResult.modifiedCount === 0) {
      res.status(404).json({ message: "Cart not found Or item not in cart" });
    }

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "User cart not found" });
    }

    const populatedItems = await populateCartItems(cart.items);
    res.status(200).json({
      items: populatedItems,
    });
  } catch (error) {
    next(error)
 }
};



export const editItem = async (req: Request, res: Response, next: NextFunction) => {
  const { quantity } = req.body;

  const { id } = req.params;

  if (!quantity) {
    return res.status(404).json({ message: "Item quantity is required" });
  }

  if (isNaN(quantity) || Number(quantity) < 0) {
    return res.status(422).json({ message: "Item quantity must be positive integer" });
  }

  const userId = req.session?.user?._id as ObjectId;

  try {
    const cart = await Cart.findOne({ userId: userId });
    
    if (!cart) {
      return res.status(404).json({ message: "User cart not found" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(422).json({message: `Requested quantity exceeds the available stock. Only ${product.stock} items left in stock.`})
    }

    await Cart.updateOne(
      { userId: userId },
      { $set: { "items.$[elem].quantity": Number(quantity) } },
      { arrayFilters: [{ "elem.productId": id }] }
    );
    
    const populatedItems = await populateCartItems(cart.items);
    res.status(200).json({
      items: populatedItems,
    });
    
  } catch (error) {
    next(error);
  }
};

// add product item to user Cart
export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product id is required" });
  }

  if (productId.length !== 24) {
    return res.status(422).json({ message: "Invalid product id" });
  }

  const userId = req.session?.user?._id as ObjectId;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ userId: userId });

    // create new cart if not already present
    if (!cart) {
      const newCart = createCart(productId, userId);
      await newCart.save();
      const cartProducts = await populateCartItems(newCart.items);
      return res.status(201).json({ items: cartProducts });
    }

    // increase the quantity if item is already present in cart else add the item
    const cartItem = cart.items.find((item) => item.productId.equals(productId));
    if (cartItem) cartItem.quantity++;
    else cart.items.push({ productId: productId, quantity: 1 });
    await cart.save();

    // store all cart item detail objects in array
    const cartProducts = await populateCartItems(cart.items);
    res.status(201).json({ items: cartProducts });
  } catch (error) {
    next(error);
  }
};

// helper func to create Cart  document
function createCart(productId: ObjectId, userId: ObjectId | string): ICart {
  return new Cart({
    userId: userId,
    items: [
      {
        productId: productId,
        quantity: 1,
      },
    ],
  });
}
