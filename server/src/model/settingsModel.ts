import { Schema, model } from "mongoose";

export interface IShippingConfig {
  _id: string;
  freeShippingThreshold: number;
  shippingRate: number;
}

const shippingConfigSchema = new Schema<IShippingConfig>(
  {
    _id: {
      type: String,
    },
    freeShippingThreshold: {
      type: Number,
      required: true,
    },
    shippingRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ShippingConfig = model<IShippingConfig>("shippingConfigs", shippingConfigSchema);

export default ShippingConfig;
