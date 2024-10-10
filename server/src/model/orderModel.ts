import mongoose, { Document, Schema, model } from "mongoose";
import Product, { IProduct } from "./productModel.ts";
import ShippingAddress from "./shippingAddressModel.ts";

interface IOrderProduct {
  product: mongoose.Types.ObjectId|IProduct;
  quantity: number;
}

export interface IOrder {
  orderId: string;
  shippingCost: number;
  subTotal: number;
  products: IOrderProduct[];
  paymentMethod: string;
  shippingAddress: mongoose.Types.ObjectId;
}

export interface IOrderDocument extends IOrder, Document { };

const orderSchema = new Schema<IOrderDocument>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Product,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            default: 1,
          },
        },
      ],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "bank", "jazz-cash"],
      trim: true,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ShippingAddress,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrderDocument>("orders", orderSchema);
export default Order;