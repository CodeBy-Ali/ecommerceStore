import mongoose, { Schema, model } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  price: number;
  usage: string;
  ingredients: string;
  weight: string;
  categories: Array<string>;
  images: Array<string>;
  salesCount: number;
  stock: number;
  slug: string;
  boughtTogether?: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
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
        enum: ["body", "face", "hair", "handSoap", "moisturizer", "shave", "shampoo", "rephils", "bodyWash", "conditioner", "cleanser"],
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
      validate: [(val: Array<string>) => val.length >= 3, "product must have minimum 3 images src url"],
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
    ref: Product
  }
})

export default Product;
