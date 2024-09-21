import { NextFunction, Request, Response } from "express";
import { getUserConfig } from "../utils/userUtils.ts";
import Cart from "../model/cartModel.ts";
import { getShippingConfig } from "../utils/cartUtils.ts";

// render home view
export const renderHomeView = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    res.render("home", userConfig);
  } catch (error) {
    next(error);
  }
};

// render checkout view
export const renderCheckoutView = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    const { subTotal, shippingConfig: shippingConfig } = userConfig;
    const shippingCost = shippingConfig && subTotal < shippingConfig?.freeShippingThreshold ? shippingConfig.shippingRate : 0;
    res.render("checkout", {
      ...userConfig,
      shippingCost,
    });
  } catch (error) {
    next(error);
  }
};
