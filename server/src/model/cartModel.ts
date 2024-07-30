import mongoose, { Schema, model } from "mongoose";
import { Document,Types } from "mongoose";
import { ObjectId } from "mongodb";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: Array<ICartItem>;
}

const cartSchema: Schema = new Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,

      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = model<ICart>("cart", cartSchema);
export default Cart;
