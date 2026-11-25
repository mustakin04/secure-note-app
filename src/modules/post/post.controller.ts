import type{ Request, Response } from "express";
import { PostService } from "./post.service.js";


const createPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await PostService.createPost(
      req.body,
      userId!
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await PostService.getUserPosts(userId as string, {
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      message: "User posts retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve user posts",
    });
  }
};

export const PostController = {
    createPost,
  getUserPosts,
};