import { Request, Response } from "express";
import Product, { IProduct } from "../model/productModel";
import { HydratedDocument, Model } from "mongoose";

export const renderCollectionsView = async (req: Request, res: Response): Promise<void> => {
  try {
    const products: HydratedDocument<IProduct>[] = await Product.find();
    res.render('collections',products );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
