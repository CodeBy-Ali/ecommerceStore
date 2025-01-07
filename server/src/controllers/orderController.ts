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
import { getRandomString } from "../utils/utils.ts";
import sendMail from "../features/sendEmail/sendEmail.ts";
import User, { IUserDocument } from "../model/userModel.ts";
import config from "../config/config.ts";
import ShippingAddress from "../model/shippingAddressModel.ts";

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
    const userDocument = (await User.findOne({
      _id: user._id,
    })) as IUserDocument;
    const connection = mongoose.connection;
    await connection.transaction(async () => {
      const orderInfo = await getOrderInfo(req.body, user._id);
      const order = new Order(orderInfo);
      await order.save();
      await removeOrderedItemsFromCart(body.cartId);

      sendMail({
        subject: `Order Confirmed: ${order.orderId}`,
        html: getOrderConfirmationEmailTemplate(
          order,
          `${userDocument.firstName} ${userDocument.lastName}`
        ),
        from: config.getOAuthConfig().email,
        to: userDocument.email,
      });

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

async function getOrderInfo(
  reqBody: ICheckoutRequestBody,
  userId: mongoose.Types.ObjectId
): Promise<IOrder> {
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
  const baseString = "#PHL";
  const orderNumber = (await Order.find({})).length + 1;
  const randomString = getRandomString(3);
  return baseString + randomString + orderNumber.toString();
}

function getOrderConfirmationEmailTemplate(order: IOrder, userName: string) {
  return /*html*/ `
    <h1>Hi ${userName}</h1>

    <p>
      Thank you for your recent purchase with Nexus. Your order<strong>${
        order.orderId
      }</strong> is confirmed. Here are the details: 
    </p>

    <p><strong>Total Item(s)</strong>: ${order.products.length}</p>  
    <p><strong>Order Subtotal</strong>: ${order.subTotal}</p>
    <p><strong>Sipping Cost</strong>: ${order.shippingCost || "Free"}</p>
    <p><strong>Total</strong>: ${order.subTotal + order.shippingCost}</p>

    <p>Thank you for shopping with us!</p>
  `;
}
