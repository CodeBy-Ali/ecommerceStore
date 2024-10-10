import mongoose, { model, Schema, Types } from "mongoose";

export interface IShippingAddress  {
  email: string;
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode?: string;
  phone: string;
  country: string,
  province: string;
  isDefault:boolean
}

export const shippingAddressSchema = new Schema<IShippingAddress>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  apartment: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    required: true,
  }
},{
  versionKey: false,
});

const ShippingAddress = model<IShippingAddress>(
  "shippingAddresses",
  shippingAddressSchema
);

export default ShippingAddress;
