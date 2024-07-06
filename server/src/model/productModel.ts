import { Schema ,model} from "mongoose";


export interface IProduct{
  title: string,
  description: string,
  price: number,
  usage: string,
  ingredients: string,
  weight: string,
  category: string,
  image: string,
}

const productSchema= new Schema<IProduct>({
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
    trim: true,
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
  }
})

const Product = model<IProduct>("Product", productSchema);

export default Product;