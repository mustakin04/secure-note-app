
import mongoose, { Schema, Types } from "mongoose";

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  content: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Find posts by user + pagination
postSchema.index(
  { user: 1, createdAt: -1, _id: -1 },
  {
    name: "posts_user_createdAt_id_idx",
  }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
