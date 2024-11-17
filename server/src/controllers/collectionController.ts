import { NextFunction, Request, Response } from "express";
import Product, { IProduct } from "../model/productModel.ts";
import { getUserConfig } from "../utils/userUtils.ts";
import { capitalizeFirstLetter } from "../utils/utils.ts";

// render collection view
export const renderAllCollectionsView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.session.user;
  try {
    const allProducts: Array<IProduct> = await Product.find().lean().exec();
    const bestSellers: Array<IProduct> = await Product.find()
      .sort({ salesCount: "descending" })
      .limit(4)
      .lean();
    const userConfig = await getUserConfig(user);

    res.render("allCollections", {
      ...userConfig,
      bestSellers: bestSellers,
      body: allProducts.filter((product: IProduct) =>
        product.categories.includes("body")
      ),
      cleansers: allProducts.filter((product: IProduct) =>
        product.categories.includes("cleansers")
      ),
      conditioners: allProducts.filter((product: IProduct) =>
        product.categories.includes("conditioner")
      ),
      face: allProducts.filter((product: IProduct) =>
        product.categories.includes("face")
      ),
      rePhils: allProducts.filter((product: IProduct) =>
        product.categories.includes("rephils")
      ),
    });
  } catch (error) {
    next(error);
  }
};

export const renderBestSellerCollectionView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.session.user;
  try {
    const userConfig = await getUserConfig(user);
    const bestSellerProducts: Array<IProduct> = await Product.find()
      .sort({ salesCount: "descending" })
      .limit(3)
      .lean();
    res.render("collection", {
      ...userConfig,
      collectionName: "Best Sellers",
      products: bestSellerProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const renderCollectionView = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.session.user;
  const { collection } = req.params;
  try {
    const userConfig = await getUserConfig(user);
    const products = await Product.find({ categories: collection });

    res.render("collection", {
      ...userConfig,
      collectionName: capitalizeFirstLetter(collection),
      products,
    });
  } catch (error) {
    next(error);
  }
};
