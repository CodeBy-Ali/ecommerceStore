import {Request,Response} from 'express'
import Product, { IProduct } from "../model/productModel.ts";
import { populateCartItems } from '../utils/utils.ts';
import Cart from '../model/cartModel.ts';


// render collection view
export const renderCollectionsView = async (req: Request, res: Response): Promise<void> => {
  const user = req.session.user;
  try { 
    const allProducts: Array<IProduct> = await Product.find().lean(); 
    const bestSellers: Array<IProduct> = await Product.find().sort({'salesCount': 'descending'}).limit(3).lean();
    const cart = await Cart.findOne({ userId: user }).lean();
    const cartItems = cart ? await populateCartItems(cart.items) : []; 
    res.render('collections', {
      "bestSellers": bestSellers,
      "body": allProducts.filter((product: IProduct) => product.category.includes('body')),
      "cleansers": allProducts.filter((product: IProduct) => product.category.includes('cleanser')),
      "conditioners": allProducts.filter((product: IProduct) => product.category.includes('conditioner')),
      "user": user,
      "cartItems": cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};