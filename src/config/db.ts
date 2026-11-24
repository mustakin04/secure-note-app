
import mongoose from "mongoose";
import User from "../modules/user/user.model.js";
import Note from "../modules/note/note.model.js";
import Post from "../modules/post/post.model.js";


const connectDB = async (): Promise<void> => {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is missing!");
    }

    await mongoose.connect(databaseUrl);

    console.log("MongoDB connected successfully!");

    await Promise.all([
      User.createIndexes(),
      Note.createIndexes(),
      Post.createIndexes(),
    ]);

    console.log("Database indexes created successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
