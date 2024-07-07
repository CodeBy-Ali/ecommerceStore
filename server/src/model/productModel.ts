import { Schema ,model, Document,Model} from "mongoose";


export interface IProduct{
  title: string,
  description: string,
  price: number,
  usage: string,
  ingredients: string,
  weight: string,
  category: string,
  image: string,
  salesCount: number,
  stockQuantity: number,
}

const productSchema:Schema = new Schema<IProduct>({
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
  category: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  salesCount: {
    type: Number,
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  }
})

const Product = model<IProduct>("products", productSchema);

export default Product;