import mongoose, { Document, Schema, model } from "mongoose";

type ProductCategory =Array<
  | "body"
  | "face"
  | "hair"
  | "handSoap"
  | "moisturizer"
  | "shave"
  | "shampoo"
  | "rephils"
  | "bodyWash"
  | "conditioner"
  | "cleansers">;

export interface IProduct {
  title: string;
  description: string;
  price: number;
  usage: string;
  ingredients: string;
  weight: string;
  categories: ProductCategory;
  images: Array<string>;
  salesCount: number;
  stock: number;
  slug: string;
  boughtTogether?: mongoose.Types.ObjectId;
}

export interface IProductDocument extends Document, IProduct {}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    usage: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: String,
      required: true,
      trim: true,
    },
    weight: {
      type: String,
      required: true,
      trim: true,
    },
    categories: [
      {
        type: String,
        required: true,
        trim: true,
        enum: [
          "body",
          "face",
          "hair",
          "handSoap",
          "moisturizer",
          "shave",
          "shampoo",
          "rephils",
          "bodyWash",
          "conditioner",
          "cleansers",
        ],
      },
    ],
    images: {
      type: [
        {
          type: String,
          required: true,
          trim: true,
        },
      ],
      validate: [
        (val: Array<string>) => val.length >= 3,
        "product must have minimum 3 images src url",
      ],
    },

    salesCount: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = model<IProduct>("products", productSchema);

// add boughtTogether product
productSchema.add({
  boughtTogether: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
  },
});

export default Product;
