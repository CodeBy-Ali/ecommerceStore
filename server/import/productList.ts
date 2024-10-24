import mongoose from 'mongoose';
import { IProduct } from '../src/model/productModel.ts';
import { IShippingConfig } from '../src/model/settingsModel.ts';
const productList: Array<IProduct> = [
  {
    title: "100% Plant Squalane - rePhil",
    description: "Universal facial serum made from 100% upcycled plant squalane in biodegradable, single-use seaweed capsules.  Use for daily lightweight, easily absorbed hydration and support. Packaged in paperboard jar.",
    price: 19.99,
    weight: "20 single use capsules | .3mL each",
    usage: "Twist top off, squeeze onto fingertips and apply to face and neck.  Capsule can be dissolved in hot water after use.  Or just throw it in the toilet.  Or at a friend.   It's waterway-safe, so it's all good.",
    ingredients: "100% Planet Squalane",
    categories: ["rephils"],
    images: ["/assets/plantSqualaneRePhil1.jpg", "/assets/plantSqualaneRePhil2.jpg", "/assets/plantSqualaneRePhil3.jpg"],
    salesCount: 5,
    stock: 18,
    slug: "plant-squalane-rephil"

  },
];

export default productList;
