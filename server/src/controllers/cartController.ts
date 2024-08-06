import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Cart, { ICart, ICartItem } from "../model/cartModel.ts";
import Product from "../model/productModel.ts";
import StoreSetting from "../model/settingsModel.ts";
import { populateCartItems } from "../utils/cartUtils.ts";


// TODO Refactor cart controllers functions to make them modular
// delete item from cart
export const deleteItem = async (req: Request, res: Response,next:NextFunction) => {
  const { id } = req.params;

  try {
    const userId = req.session?.user?._id;
    const updatedResult = await Cart.updateOne({ userId: userId }, { $pull: { items: { productId: id } } });
    if (updatedResult.modifiedCount === 0) {
      res.status(404).json({ status: 'fail', message: "Cart not found Or item not in cart" });
    }
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ status: 'fail',message: "User cart not found" });
    }
    const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' },{_id:0}).lean();
    if (!shippingConfig) {
      return res.status(404).json({ status: 'fail',message: "Store shipping config not found" });
    }
    // store all cart item detail objects in array
    const populatedItems = await populateCartItems(cart.items);
    res.status(201).json({
      status: 'success',
      data: {
        cartItems: populatedItems,
        storeSettings: shippingConfig,
      }
    });
  } catch (error) {
    next(error)
 }
};



// increase or decrease cart quantity
export const editItem = async (req: Request, res: Response, next: NextFunction) => {
  const { quantity } = req.body;
  const { id } = req.params;
  if (!quantity) {
    return res.status(400).json({
      status: 'fail',
      message: "Missing required filed: quantity"
    });
  }
  if (isNaN(quantity) || Number(quantity) < 0) {
    return res.status(422).json({
      status: 'fail',
      message: "Item quantity must be positive integer"
    });
  }
  const userId = req.session?.user?._id;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: "Product not found"
      });
    }
    if (quantity > product.stock) {
      return res.status(422).json({
        status: 'fail',
        message: `Requested quantity exceeds the available stock. Only ${product.stock} items left in stock.`
      });
    }
    await Cart.updateOne(
      { userId: userId },
      { $set: { "items.$[elem].quantity": Number(quantity) } },
      { arrayFilters: [{ "elem.productId": id }] }
    );
    const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' },{_id:0}).lean();
    if (!shippingConfig) {
      return res.status(404).json({
        status: "fail",
        message: "Store shipping config not found"
      });
    }
    const cart = await Cart.findOne({ userId: userId });
    
    if (!cart) {
      return res.status(404).json({
        status: 'fail',
        message: "User cart not found"
      });
    }
    
    const populatedItems = await populateCartItems(cart.items);
    res.status(200).json({
      status: "success",
      data: {
        cartItems: populatedItems,
        storeSettings: shippingConfig,
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// add product item to user Cart
export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  const { productId,quantity } = req.body;
  if (!productId) {
    return res.status(400).json({
      status: 'fail',
      message: "Missing required field: productId"
    });
  }
  if (isNaN(quantity) || Number(quantity) < 0) {
    return res.status(422).json({
      status: 'fail',
      message: "Invalid request: quantity must be positive integer"
    });
  }
  const user = req.session.user;
  if (!user) { 
    return res.status(401).json({
      status: 'fail',
      message: "Unauthorized access. Please log in to continue"
    });
  };
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: "Product not found"
      });
    }
    // get store shipping information
    const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' },{_id:0}).lean() || {};
    if (!shippingConfig) {
      return res.status(404).json({
        status: "fail",
        message: "Store shipping config not found"
      });
    }
    const cart = await Cart.findOne({ userId: user._id });
    // create new cart if not already present
    if (!cart) {
      const newCart = createCart(productId,Number(quantity), user._id);
      await newCart.save();
      const populatedItems = await populateCartItems(newCart.items);
      return res.status(201).json({
        status: "success",
        data: {
          cartItems: populatedItems,
          storeSettings: shippingConfig
        }
      });
    }
    // increase the quantity if item is already present in cart and stock is available else add the item
    const cartItem = cart.items.find((item) => item.productId.equals(productId));
    if (!cartItem) cart.items.push({ productId, quantity});
    else if (cartItem.quantity < product.stock) cartItem.quantity++;
    else {
      return res.status(422).json({
        status: "fail",
        message: `Maximum stock reached. ${product.stock - cartItem.quantity} units of ${product.title} available.`
      });
    }
    await cart.save();
    // store all cart item detail objects in array
    const populatedItems = await populateCartItems(cart.items);
    res.status(201).json({
      status: "success",
      data: {
        cartItems: populatedItems,
        storeSettings: shippingConfig,
      }
    });
  } catch (error) {
    next(error);
  }
};

// helper func to create Cart  document
function createCart(productId: mongoose.Types.ObjectId,quantity:number, userId: mongoose.Types.ObjectId): ICart {
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
