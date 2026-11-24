
import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Unique email index
userSchema.index(
  { email: 1 },
  {
    unique: true,
    name: "email_unique_idx",
  }
);

// Admin user listing index
userSchema.index(
  { createdAt: -1, _id: -1 },
  {
    name: "users_createdAt_id_idx",
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
