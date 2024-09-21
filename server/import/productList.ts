import mongoose from 'mongoose';
import { IProduct } from '../src/model/productModel.ts';
import { IShippingConfig } from '../src/model/settingsModel.ts';
const productList: Array<IShippingConfig> = [
  {
    _id: "shipping_config",
    freeShippingThreshold: 5000,
    shippingRate: 450,
  },
];

export default productList;
