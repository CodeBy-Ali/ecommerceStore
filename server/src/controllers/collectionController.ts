import { NextFunction, Request, Response } from "express";
import Product, { IProduct } from "../model/productModel.ts";
import { getUserConfig } from "../utils/userUtils.ts";
import { capitalizeFirstLetter } from "../utils/utils.ts";

// render collection view
export const renderAllCollectionsView = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.session.user;
  try {
    const allProducts: Array<IProduct> = await Product.find().lean();
    const bestSellers: Array<IProduct> = await Product.find().sort({ salesCount: "descending" }).limit(3).lean();
    const userConfig = await getUserConfig(user);

    res.render("allCollections", {
      ...userConfig,
      bestSellers: bestSellers,
      body: allProducts.filter((product: IProduct) => product.category.includes("body")),
      cleansers: allProducts.filter((product: IProduct) => product.category.includes("cleansers")),
      conditioners: allProducts.filter((product: IProduct) => product.category.includes("conditioner")),
    });
  } catch (error) {
    next(error);
  }
};  

export const renderBestSellerCollectionView = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    const bestSellerProducts: Array<IProduct> = await Product.find().sort({ salesCount: "descending" }).limit(3).lean();
    res.render("collection", {
      ...userConfig,
      collectionName: "Best Sellers",
      products: bestSellerProducts,
    });
  } catch (error) {
    next(error);
  }
};


export const renderCollectionView = async (collectionName: string, req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    const products = await Product.find({ category: collectionName });

    res.render('collection', {
      ...userConfig,
      collectionName: capitalizeFirstLetter(collectionName),
      products,
    })
  } catch (error){
    next(error)
  }
}