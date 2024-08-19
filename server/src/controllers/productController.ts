import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.ts";
import Product from "../model/productModel.ts";
import { getUserConfig } from "../utils/userUtils.ts";



export const renderProductView = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    const product = await Product.findOne({ slug: name }).populate('boughtTogether').lean().exec();
    
    if (!product) {
      logger.error("Product not found. Request: %o", req);
      return res.render('notFound', userConfig);
    }

    const relatedProductQuantity = 3;
    const relatedProducts = await getRelatedProducts(product.categories,relatedProductQuantity);
    res.render('product', { ...userConfig, product,relatedProducts });
  } catch (error) {
    next(error); 
  }
}


async function getRelatedProducts(categories: string[],quantity:number) {
  const products = [];
  for await (const category of categories) {
    const categoryProducts = await Product.find({ categories: category }).limit(quantity).lean().exec()
    products.push(...categoryProducts);
    if (products.length === quantity) break;
  }
  return products;
}