import mongoose from "mongoose";
import Post from "./post.model.js";

interface ICreatePostPayload {
  title: string;
  content: string;
}

const createPost = async (
  payload: ICreatePostPayload,
  userId: string
) => {
  const post = await Post.create({
    title: payload.title,
    content: payload.content,
    user: userId,
  });

  return post;
};





interface IUserPostsQuery {
  page: number;
  limit: number;
}

const getUserPosts = async (
  userId: string,
  query: IUserPostsQuery
) => {
  // 1. Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // 2. Pagination calculation
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  // 3. Aggregation Pipeline
  const result = await Post.aggregate([
    // Stage 1: Find posts of a particular user
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },

    // Stage 2: Sort posts
    {
      $sort: {
        createdAt: -1,
        _id: -1,
      },
    },

    // Stage 3: Pagination and total count
    {
      $facet: {
        posts: [
          { $skip: skip },
          { $limit: limit },

          // Stage 4: Join Users collection
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    email: 1,
                    role: 1,
                  },
                },
              ],
              as: "author",
            },
          },

          // Stage 5: Convert author array into object
          {
            $unwind: "$author",
          },

          // Stage 6: Select required fields
          {
            $project: {
              title: 1,
              content: 1,
              user: 1,
              author: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],

        pagination: [
          {
            $count: "total",
          },
        ],
      },
    },
  ]);

  // 4. Extract aggregation result
  const posts = result[0]?.posts || [];
  const total = result[0]?.pagination[0]?.total || 0;

  return {
    posts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const PostService = {
    createPost,
  getUserPosts,
};