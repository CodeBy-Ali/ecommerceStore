import mongoose, { Document, Schema, model, } from "mongoose";

// TODO add news subscription feature

// interface represents the user document in database
export interface IUser {
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string,
  avatar?: string,
  isSubscribedToNews?: boolean,
}
// user schema corresponding to user interface

export interface IUserDocument extends IUser,Document{}

const userSchema = new Schema<IUserDocument>({
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
  },
  isSubscribedToNews: {
    type: Boolean,
  }
})


const User = model<IUserDocument>("users", userSchema);

export default User;