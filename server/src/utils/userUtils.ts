import { UserSession } from "../app/app.ts";
import Cart from "../model/cartModel.ts";
import { IStoreSettings } from "../model/settingsModel.ts";
import { populateCartItems } from "./cartUtils.ts";
import StoreSetting from "../model/settingsModel.ts";
import { CartItemDetail } from "./cartUtils.ts";

interface UserConfig{
  user: UserSession | null,
  cartItems: CartItemDetail[] | [],
  storeSettings: IStoreSettings | null,
}


export const getUserConfig = async (user: UserSession | undefined):Promise<UserConfig> => {
  if (!user) return {
    user: null,
    cartItems: [],
    storeSettings: null,
  }
  const cart = await Cart.findOne({ userId: user._id }).lean().exec();
  const cartItems = cart ? await populateCartItems(cart.items) : [];  
  const shippingConfig = await StoreSetting.findOne({ _id: 'shipping_config' }).lean().exec();
  return {
    user,
    cartItems,
    storeSettings: shippingConfig ? shippingConfig : null
  }
}