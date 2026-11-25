import User from "./user.model.js";
import mongoose from "mongoose";


const getAllUsers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  // Fetch users and total count simultaneously
  const [users, totalUsers] = await Promise.all([
    User.find()
      .select("_id name email role interests createdAt updatedAt")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    pagination: {
      total: totalUsers,
      page,
      limit,
      totalPages,
    },
  };
};

const getUserById = async (userId: string) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(userId)
    .select("_id name email role interests createdAt updatedAt")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: "USER" | "ADMIN";
  interests?: string[];
}

const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  )
    .select("_id name email role interests createdAt updatedAt")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};


const deleteUser = async (userId: string) => {
  // Step 1: Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // Step 2: Find and delete user
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return null;
};


const groupUsersByInterests = async () => {
  const result = await User.collection.aggregate([
    // Stage 1: Separate each interest
    {
      $unwind: "$interests",
    },

    // Stage 2: Group users by interest
    {
      $group: {
        _id: "$interests",
        totalUsers: {
          $sum: 1,
        },
        users: {
          $push: {
            userId: "$_id",
            name: "$name",
            email: "$email",
          },
        },
      },
    },

    // Stage 3: Sort by interest name
    {
      $sort: {
        _id: 1,
      },
    },
  ]).toArray();

  return result;
};


export const UserService = {
  getAllUsers,
  getUserById,
   updateUser,
   deleteUser,
    groupUsersByInterests,
};
