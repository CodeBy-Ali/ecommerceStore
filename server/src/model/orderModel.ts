import mongoose, { Schema,model } from "mongoose";



interface IOrder{
  user: mongoose.Schema.Types.ObjectId
  firstName: string,
  lastName: string,
  address: string,
  city: string,
  postalCode: string,
  phone: number
  subTotal: number,
  orderId: string,
  shippingMethod: string,  
}

const orderSchema = new Schema();