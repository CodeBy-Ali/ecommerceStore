import mongoose,{Schema,model} from "mongoose"




interface ICartItem{
  productId: mongoose.Schema.Types.ObjectId;
  quantity: number,
}
interface ICart{
  userId:  mongoose.Schema.Types.ObjectId,
  items: Array<ICartItem>
}

const itemSchema = new Schema<ICartItem>({
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
})

const cartSchema:Schema = new Schema<ICart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  items: [itemSchema]
})

const Cart = model<ICart>("cart", cartSchema);
export default Cart;