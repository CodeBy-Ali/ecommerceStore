import { NextFunction, Request,Response } from 'express';
import ShippingAddress, { IShippingAddress } from '../model/shippingAddressModel.ts';
import { createError } from '../middlewares/errorHandler.ts';

// TODO add validation middleware for new shipping address request

export const addShippingAddress = async (req:Request,res:Response,next:NextFunction) => {
  type ShippingAddressReqBody = Omit<IShippingAddress,"userId"|"isDefault">
  const body = req.body as ShippingAddressReqBody;

  try {
    const user = req.session.user
    if (!user) return createError(401, "Unauthorized access. Please log in to continue", "fail");

    const newShippingAddress = new ShippingAddress<IShippingAddress>(
      {
        ...body,
        userId: user._id,
        isDefault: false
      }
    );
    newShippingAddress.save();

    res.redirect("/checkout");
  } catch (error: unknown) {
    next(error);
  }
}