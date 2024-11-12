import mongoose from "mongoose";
import { IProduct } from "../src/model/productModel.ts";
import { IShippingConfig } from "../src/model/settingsModel.ts";
const productList: Array<IProduct> = [
  {
    title: "The Everything Bar",
    description:"Tired of a shower full of plastic bottles? Tired of buying more things than you need? Soft, manageable hair AND clean pits AND smells like the freaking beach? Look no further that this guy right here that works from the ends of your hair to the tips of your toes.",
    price: 14.99,
    weight: "3.1oz (87.5g) Bar",
    usage: "Lather up and apply to wet hair working from scalp to tip.  Rinse thoroughly.  Lather up and also apply to your body and rinse thoroughly.  Keep bar dry between uses with our Phil's sustainable soap dish.  ",
    ingredients: "Sodium Cocoyl Isethionate, Hydrogenated Vegetable Oil, Polyglyceryl-4 Laurate, Water/ Aqua, Glycerin, Natural Fragrance, Butyrospermum Parkii (Shea) Butter, Salvia Hispanica (Chia) Seed Oil, Persea Gratissima (Avocado) Oil, Squalane.",
    categories: ["body","cleansers","face"],
    images: [
      "/assets/everythingBar1.jpg",
      "/assets/everythingBar2.jpg",
      "/assets/everythingBar3.jpg",
    ],
    salesCount: 24,
    stock: 20,
    slug: "the-everything-bar",
    boughtTogether: new mongoose.Types.ObjectId("672f503fad7bbf8792e3b001"),
  },
];

export default productList;
