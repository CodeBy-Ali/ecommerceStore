import {Request,Response} from 'express'
import Product, { IProduct } from "../model/productModel";



// render collection view
export const renderCollectionsView = async (req: Request, res: Response): Promise<void> => {
  try { 
    const allProducts: Array<IProduct> = await Product.find().lean(); 
    const bestSellers: Array<IProduct> = await Product.find().sort({'salesCount': 'descending'}).limit(3).lean();
    const user = req.session.user;
    res.render('collections', {
      "bestSellers": bestSellers,
      "body": allProducts.filter((product: IProduct) => product.category.includes('body')),
      "cleansers": allProducts.filter((product: IProduct) => product.category.includes('cleanser')),
      "conditioners": allProducts.filter((product: IProduct) => product.category.includes('conditioner')),
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};