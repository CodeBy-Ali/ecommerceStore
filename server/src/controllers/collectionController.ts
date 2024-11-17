import { NextFunction, Request, Response } from "express";
import Product, { IProduct, ProductCategory } from "../model/productModel.ts";
import { getUserConfig } from "../utils/userUtils.ts";
import { capitalizeFirstLetter } from "../utils/utils.ts";

type ProductCategoryMap = {
  [key in ProductCategory]?: IProduct[];
} & Object;
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
   
    let productCategoryMap: ProductCategoryMap = {};
    allProducts.forEach((product) => {
      product.categories.forEach((category: ProductCategory) => {
        if (productCategoryMap[category]) {
          productCategoryMap[category].push(product);
        } else {
          productCategoryMap[category] = [product];
        }
      });
    });

    res.render("allCollections", {
      ...userConfig,
      bestSellers,
      productCategoryMap,
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
