import { NextFunction, Request, Response } from "express";
import ShippingAddress, {
  IShippingAddress,
} from "../model/shippingAddressModel.ts";
import { createError } from "../middlewares/errorHandler.ts";
import { IShippingAddressReqBody } from "../middlewares/validator.ts";

export const addShippingAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as IShippingAddressReqBody;
  try {
    const user = req.session.user;
    if (!user)
      return createError(
        401,
        "Unauthorized access. Please log in to continue",
        "fail"
      );

    const newShippingAddress = new ShippingAddress<IShippingAddress>({
      ...body,
      userId: user._id,
      isDefault: false,
    });
    await newShippingAddress.save();

    res.redirect("/checkout");
  } catch (error: unknown) {
    next(error);
  }
};
