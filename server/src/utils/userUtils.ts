import { UserSession } from "../app/app.ts";
import Cart from "../model/cartModel.ts";
import ShippingConfig, { IShippingConfig } from "../model/settingsModel.ts";
import { populateCartItems } from "./cartUtils.ts";
import { CartItemDetail } from "./cartUtils.ts";

interface UserConfig {
  user: UserSession | null;
  cartItems: CartItemDetail[] | [];
  shippingConfig: IShippingConfig | null;
  subTotal: number;
}

export const getUserConfig = async (user: UserSession | undefined): Promise<UserConfig> => {
  if (!user)
    return {
      user: null,
      cartItems: [],
      shippingConfig: null,
      subTotal: 0,
    };

  const cart = await Cart.findOne({ userId: user._id }).lean().exec();
  const cartItems = cart ? await populateCartItems(cart.items) : [];
  const shippingConfig = await ShippingConfig.findOne({ _id: "shipping_config" }).lean().exec();
  const subTotal = Number(
    cartItems
      .reduce((subTotal, { quantity, product }) => {
        return (subTotal += product ? product.price * quantity : 0);
      }, 0)
      .toFixed(2)
  );
  return {
    user,
    cartItems,
    subTotal,
    shippingConfig
  };
};
