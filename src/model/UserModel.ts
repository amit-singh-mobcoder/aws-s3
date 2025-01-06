import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const userModel = mongoose.model<IUser>("User", userSchema);
