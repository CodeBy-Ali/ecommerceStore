import { Request,Response,NextFunction } from "express";

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