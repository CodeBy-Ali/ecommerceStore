import { NextFunction, Request, Response } from "express";
import { ICheckoutRequestBody, IRegisterRequestBody } from "./validator.ts";
import User from "../model/userModel.ts";
import { createUniqueUser, createUserSession } from "../utils/userUtils.ts";
import ShippingAddress, {
  IShippingAddress,
} from "../model/shippingAddressModel.ts";
import logger from "../config/logger.ts";
import mongoose from "mongoose";
import { createApiError } from "./errorHandler.ts";

export const registerUserIfNotAlready = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const checkoutReqBody = req.body as ICheckoutRequestBody;
  if (!checkoutReqBody.password) return next();
  try {
    const { firstName, lastName, password, email } = checkoutReqBody;
    const { user } = await createUniqueUser({
      firstName,
      lastName,
      password,
      email,
    });

    await createUserSession(user, req);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const saveShippingAddressIfChecked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const checkoutReqBody = req.body as ICheckoutRequestBody;

  if (!req.session.user) {
    logger.warn("Received request to save checkout of non registered user");
    return next();
  }
  try {
    const userId = req.session.user._id;
    const {
      cartId,
      subscribeNews,
      shippingAddressId,
      saveCheckout,
      password,
      paymentMethod,
      ...shippingAddress
    } = checkoutReqBody;

    shippingAddress.userId = userId;

    if (shippingAddressId && mongoose.isValidObjectId(shippingAddressId))
      return next();

    const duplicateAddress = await checkForDuplicateAddress(shippingAddress);
    if (duplicateAddress) {
      req.body.shippingAddressId = duplicateAddress._id;
      return next();
    }

    const defaultAddress = await createDefaultAddress(shippingAddress);
    if (defaultAddress) {
      req.body.shippingAddressId = defaultAddress._id;
      return next();
    }
    throw createApiError(400, "User shipping address is missing", "fail");
  } catch (error: unknown) {
    next(error);
  }
};

async function checkForDuplicateAddress(shippingAddress: IShippingAddress) {
  const duplicateShippingAddress = await ShippingAddress.findOne(
    shippingAddress
  );
  return duplicateShippingAddress;
}

async function createDefaultAddress(shippingAddress: IShippingAddress) {
  const isDefaultAddressSet = await ShippingAddress.findOne({
    userId: shippingAddress.userId,
    isDefault: true,
  });
  if (isDefaultAddressSet) return null;
  const defaultAddress = new ShippingAddress(shippingAddress);
  defaultAddress.isDefault = true;
  defaultAddress.save();
  return defaultAddress;
}
