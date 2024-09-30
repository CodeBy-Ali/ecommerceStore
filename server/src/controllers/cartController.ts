import { NextFunction, Request, Response } from "express";
import Cart from "../model/cartModel.ts";
import Product from "../model/productModel.ts";
import { populateCartItems } from "../utils/cartUtils.ts";
import { getShippingConfig, createCart } from "../utils/cartUtils.ts";
import { IShippingConfig } from "../model/settingsModel.ts";
import { ApiResponse } from "../interfaces/global.interfaces.ts";
import { IPopulatedCart } from "../utils/userUtils.ts";


interface ICartData{
  cart: Omit<IPopulatedCart,"subTotal">,
  shippingConfig: IShippingConfig,
}


export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const userId = req.session?.user?._id;
    const updatedResult = await Cart.updateOne({ userId: userId }, { $pull: { items: { productId: id } } });
    if (updatedResult.modifiedCount === 0) {
      res.status(404).json({ status: "fail", message: "Cart not found Or item not in cart" });
    }
    const cart = await Cart.findOne({ userId: userId }).lean().exec();
    if (!cart) {
      return res.status(404).json({ status: "fail", message: "User cart not found" });
    }
    const shippingConfig = await getShippingConfig();
    // store all cart item detail objects in array
    const populatedItems = await populateCartItems(cart.items);
    
    const data: ICartData = {
      cart: {
        _id: cart._id.toString(),
        items: populatedItems,
      },
      shippingConfig,
    };
    respond<ICartData>(res, 201, data);
  } catch (error) {
    next(error);
  }
};

// increase or decrease cart quantity
export const editItem = async (req: Request, res: Response, next: NextFunction) => {
  const { quantity } = req.body;
  const { id } = req.params;
  const userId = req.session?.user?._id;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }
    if (quantity > product.stock) {
      return res.status(422).json({
        status: "fail",
        message: `Requested quantity exceeds the available stock. Only ${product.stock} items left in stock.`,
      });
    }
    await Cart.updateOne({ userId: userId }, { $set: { "items.$[elem].quantity": Number(quantity) } }, { arrayFilters: [{ "elem.productId": id }] });
    const shippingConfig = await getShippingConfig();
    const cart = await Cart.findOne({ userId: userId }).lean().exec();
    if (!cart) {
      return res.status(404).json({ status: "fail", message: "User cart not found" });
    }
    const populatedItems = await populateCartItems(cart.items);
    const data: ICartData = {
      cart: {
        _id: cart._id.toString(),
        items: populatedItems,
      },
      shippingConfig,
    }
    respond<ICartData>(res, 201, data);
  } catch (error) {
    next(error);
  }
};

// add product item to user Cart
export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;
  const user = req.session.user;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }
    const shippingConfig = await getShippingConfig();
    const cart = await Cart.findOne({ userId: user?._id }).lean().exec();
    // create new cart if not already present
    if (!cart) {
      const newCart = createCart(productId, Number(quantity), user?._id);
      await newCart.save();
      const populatedItems = await populateCartItems(newCart.items);
      const data:ICartData = {
        cart: {
          _id: JSON.stringify(newCart._id),
          items: populatedItems,
        },
        shippingConfig,
      }
      return respond(res,201,data);
    }
    // increase the quantity if item is already present in cart and stock is available else add the item
    const cartItem = cart.items.find((item) => item.productId.equals(productId));
    if (!cartItem) cart.items.push({ productId, quantity });
    else if (cartItem.quantity + quantity < product.stock) cartItem.quantity += quantity;
    else {
      return res.status(422).json({
        status: "fail",
        message: `Given quantity exceeds the available stock of ${product.stock - cartItem.quantity} units.`,
      });
    }
    await cart.save();
    // store all cart item detail objects in array
    const populatedItems = await populateCartItems(cart.items);
    const data: ICartData = {
      cart: {
        _id: cart._id.toString(),
        items: populatedItems,
      },
      shippingConfig,
    };
    respond<ICartData>(res, 201, data);
  } catch (error) {
    next(error);
  }
};



function respond<T>(res: Response, statusCode: number, data: T | null, message?: string,  ) {
  const responseBody: ApiResponse<T> = {
    status: statusCode < 300 ? "success" : statusCode < 500 ? "fail" : "error",
    data,
    message,
  };
  res.status(statusCode).json(responseBody);
}