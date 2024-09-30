import { model, Schema } from "mongoose";

export interface ICheckout {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode?: string;
  phone: number;
  payment: string;
}

const savedCheckoutSchema = new Schema<ICheckout>({
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
  address: {
    type: String,
    required: true,
    trim: true,
  },
  apartment: {
    type: String,
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
    type: Number,
    required: true,
    trim: true,
  },
  payment: {
    type: String,
    required: true,
    trim: true,
  },
});

const SavedCheckout = model<ICheckout>("savedCheckouts", savedCheckoutSchema);

export default SavedCheckout;
