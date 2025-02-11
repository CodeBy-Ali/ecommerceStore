import { NextFunction, Request, Response } from "express";
import { getUserConfig } from "../utils/userUtils.ts";
import Cart from "../model/cartModel.ts";
import { getShippingConfig } from "../utils/cartUtils.ts";
import { ApiError, createApiError } from "../middlewares/errorHandler.ts";
import Order from "../model/orderModel.ts";
import mongoose from "mongoose";
import ShippingAddress from "../model/shippingAddressModel.ts";
import Product, { IProduct } from "../model/productModel.ts";

// render home view
export const renderHomeView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    const featuredProducts: Array<IProduct> = await Product.find()
      .sort({ salesCount: "descending" })
      .limit(4)
      .lean();
    res.render("home", {
      ...userConfig,
      featuredProducts,
    });
  } catch (error) {
    next(error);
  }
};

// render checkout view
export const renderCheckoutView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    const { cart, shippingConfig: shippingConfig } = userConfig;
    const shippingAddresses = user
      ? await ShippingAddress.find({ userId: user?._id })
      : [];
    const shippingCost =
      shippingConfig &&
      cart &&
      cart.subTotal < shippingConfig?.freeShippingThreshold
        ? shippingConfig.shippingRate
        : 0;
    res.render("checkout", {
      ...userConfig,
      shippingCost,
      shippingAddresses,
    });
  } catch (error) {
    next(error);
  }
};

export const renderOrderView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);

    if (!mongoose.isValidObjectId(id)) {
      return res.render("notFound", userConfig);
    }

    const order = await Order.findOne({ _id: id })
      .populate({ path: "products", populate: "product" })
      .populate("shippingAddress")
      .lean()
      .exec();

    if (!order) {
      return res.render("notFound", userConfig);
    }
    res.render("order", {
      ...userConfig,
      order,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const renderUserAccountView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.session.user;
  try {
    if (!user)
      throw createApiError(
        401,
        "Unauthorized access. Please log in to continue",
        "fail"
      );

    const account = await ShippingAddress.findOne({
      userId: user._id,
      isDefault: true,
    });

    const orders = await Order.find({ userId: user._id });

    res.render("account", { account, orders });
  } catch (error: unknown) {
    next(error);
  }
};
