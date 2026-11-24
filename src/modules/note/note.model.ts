
import mongoose, { Schema, Types } from "mongoose";

export interface INote {
  _id: Types.ObjectId;
  title: string;
  content: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
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

// User's own notes + pagination
noteSchema.index(
  { user: 1, createdAt: -1, _id: -1 },
  {
    name: "notes_user_createdAt_id_idx",
  }
);

// Admin's all notes + pagination
noteSchema.index(
  { createdAt: -1, _id: -1 },
  {
    name: "notes_createdAt_id_idx",
  }
);

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;
