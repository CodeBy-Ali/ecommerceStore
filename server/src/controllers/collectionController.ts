import {NextFunction, Request,Response} from 'express'
import Product, { IProduct } from "../model/productModel.ts";
import { populateCartItems } from '../utils/utils.ts';
import Cart from '../model/cartModel.ts';
import StoreSetting from '../model/settingsModel.ts';

// render collection view
export const renderCollectionsView = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
  const user = req.session.user;
  try { 
    const allProducts: Array<IProduct> = await Product.find().lean(); 
    const bestSellers: Array<IProduct> = await Product.find().sort({'salesCount': 'descending'}).limit(3).lean();
    const cart = await Cart.findOne({ userId: user }).lean();
    const cartItems = cart ? await populateCartItems(cart.items) : []; 
    const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' }).lean();
    if (!shippingConfig) throw new Error('shipping_config document not found');
    res.render('collections', {
      "bestSellers": bestSellers,
      "body": allProducts.filter((product: IProduct) => product.category.includes('body')),
      "cleansers": allProducts.filter((product: IProduct) => product.category.includes('cleanser')),
      "conditioners": allProducts.filter((product: IProduct) => product.category.includes('conditioner')),
      "user": user,
      "cartItems": cartItems,
      "storeSettings": shippingConfig,
    });
  } catch (error) {
    next(error)
  }
};