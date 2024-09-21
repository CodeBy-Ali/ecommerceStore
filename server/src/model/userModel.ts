import { Schema, model, } from "mongoose";


// interface represents the user document in database
export interface IUser{
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  avatar?: string,
}

// user schema corresponding to user interface

const userSchema = new Schema<IUser>({
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
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  }
})


const User = model<IUser>("users", userSchema);

export default User;