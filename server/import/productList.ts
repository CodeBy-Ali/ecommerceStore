import mongoose from "mongoose";
import { IProduct } from "../src/model/productModel.ts";
import { IShippingConfig } from "../src/model/settingsModel.ts";
const productList: Array<IProduct> = [
  {
    title: "100% Plant Squalane",
    description:"Universal facial serum made from 100% upcycled plant squalane in biodegradable, single-use seaweed capsules.  Use for daily lightweight, easily absorbed hydration and support.",
    price: 2400,
    weight: "20 single use capsules | .3mL each",
    usage: "Twist top off capsule, squeeze onto fingertips and apply to face and neck.  Capsule can be dissolved in hot water after use.  Or just throw it in the toilet.  Or at a friend.  It's waterway-safe, so it's all good.",
    ingredients: "100% Plant Squalane",
    categories: ["moisturizer"],
    images: [
      "/assets/plantSqualane1.jpg",
      "/assets/plantSqualane2.jpg",
      "/assets/plantSqualane3.jpg",
    ],
    salesCount: 14,
    stock: 20,
    slug: "plant-squalane",
    boughtTogether: new mongoose.Types.ObjectId("672f4d4d550f27396c210ec4")
  },
];

export default productList;
