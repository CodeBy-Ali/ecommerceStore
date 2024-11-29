import mongoose from "mongoose";
import { IProduct } from "../src/model/productModel.ts";
import { IShippingConfig } from "../src/model/settingsModel.ts";
const productList: Array<IProduct> = [
  {
    title: "Hand Soap rePhil Pack",
    description: "Pure castile hand soap concentrate rePhils for a light, frothy cleanse.  Ultra gentle and fragrance-free.  Pack of 6 individual refills.",
    price: 500,
    weight: ".5oz/15g each",
    usage: "Add this sachet of concentrated castile soap to your Phil's foamer bottle, fill halfway with water.  Shake vigorously.  Add more water, leaving enough space to not overflow when the pump is reinserted.  Shake again.  Pump for a rich, creamy foaming soap.",
    ingredients: "Sodium Cocoate, Sodium Sunflowerate (Saponified Organic Coconut Oil and Sunflower Oil)",
    categories: ["rephil","handSoap"],
    images: [
      "/assets/handSoapRephil1.jpg",
      "/assets/handSoapRephil2.jpg",
      "/assets/handSoapRephil3.jpg",
    ],
    salesCount: 5,
    stock: 10,
    slug: "hand-soap-rephil-pack",
  },
];

export default productList;
