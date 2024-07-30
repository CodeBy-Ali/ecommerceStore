import { Request,Response,NextFunction } from "express";
import Cart from "../model/cartModel.ts";
import { populateCartItems } from "../utils/utils.ts";
import StoreSetting from "../model/settingsModel.ts";

const renderStaticView = async (viewName: string, req: Request, res: Response, next: NextFunction) => {
  const user = req.session.user;
  try {
    const cart = await Cart.findOne({ userId: user }).lean();
    const cartItems = cart ? await populateCartItems(cart.items) : []; 
    const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' }).lean();
    if (!shippingConfig) throw new Error('shipping_config document not found');
    res.render(viewName, {
      user,
      cartItems,
      'storeSettings': shippingConfig,
    });
  } catch(error) {
    next(error)
  }
}



export default renderStaticView;