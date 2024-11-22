import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.ts";
import { ICheckoutRequestBody } from "../middlewares/validator.ts";
import Order, { IOrder } from "../model/orderModel.ts";
import Cart from "../model/cartModel.ts";
import {
  calculateProductSubtotal as calculateCartSubTotal,
  getShippingConfig,
} from "../utils/cartUtils.ts";
import { IPopulatedCartItem } from "../utils/userUtils.ts";
import { createApiError } from "../middlewares/errorHandler.ts";
import mongoose from "mongoose";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as ICheckoutRequestBody;
  const user = req.session.user;

  try {
    if (!user)
      throw createApiError(
        401,
        "Unauthorized access. Please log in to continue",
        "fail"
      );
    const connection = mongoose.connection;
    await connection.transaction(async () => {
      const orderInfo = await getOrderInfo(req.body,user._id);
      const order = new Order(orderInfo);
      await order.save();
      await removeOrderedItemsFromCart(body.cartId);
      res.redirect(`/orders/${order._id}`);
    });
  } catch (error: unknown) {
    next(error);
  }
};

async function removeOrderedItemsFromCart(
  cartId: mongoose.Types.ObjectId | string
) {
  try {
    await Cart.updateOne({ _id: cartId }, { $set: { items: [] } });
  } catch (error: unknown) {
    logger.error("Failed to delete ordered items from cart");
    throw error;
  }
}

async function getOrderInfo(reqBody: ICheckoutRequestBody,userId: mongoose.Types.ObjectId): Promise<IOrder> {
  const { shippingAddressId } = reqBody;
  if (!shippingAddressId || !mongoose.isValidObjectId(shippingAddressId)) {
    throw createApiError(404, "User Order shipping address not found", "fail");
  }

  const userCart = await Cart.findOne({ _id: reqBody?.cartId });
  if (!userCart) throw createApiError(404, "User Cart not found", "fail");

  const products = userCart.items;
  await userCart.populate({ path: "items", populate: "product" });

  const subTotal = calculateCartSubTotal(
    userCart.items as IPopulatedCartItem[]
  );

  const { freeShippingThreshold, shippingRate } = await getShippingConfig();
  const shippingCost = subTotal > freeShippingThreshold ? 0 : shippingRate;

  const orderId = await createOrderId();
  return {
    orderId,
    shippingCost,
    subTotal,
    shippingAddress: new mongoose.Types.ObjectId(shippingAddressId),
    products,
    paymentMethod: reqBody.paymentMethod,
    userId,
  };
}

async function createOrderId() {
  const orderNumber = (await Order.find({})).length + 1;
  return "#PHL" + orderNumber.toString();
}
