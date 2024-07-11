import { Schema, model, } from "mongoose";


// interface represents the user document in database
interface IUser{
  name: string,
  email: string,
  avatar?: string,
}

// user schema corresponding to user interface

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  avatar: {
    type: String,
  }
})


const User = model<IUser>("users", userSchema);

export default User;