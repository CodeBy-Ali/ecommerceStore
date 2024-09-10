import { Request,Response,NextFunction } from "express";
import Cart from "../model/cartModel.ts";

export const validateCartRequest = (req:Request, res:Response, next:NextFunction) => {
  const { quantity } = req.body;
  const id  = req.params.id || req.body.productId;
  
  if (!id) {
    return res.status(400).json({ message: "Missing required parameter: productId" });
  }
  
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
  next();
}


export const redirectForEmptyCart = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session?.user?._id;
  try {
    const cart = userId ? await Cart.findOne({ userId }).lean().exec() : null;
    if (!cart || cart.items.length === 0) {
      return res.redirect('/collections');
    }
    next();
  } catch (error: any) {
    next(error);
  }
}