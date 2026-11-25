
import type{ Request, Response } from "express";
import { UserService } from "./user.service.js";


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const parsedPage = Number.parseInt(
      String(req.query.page ?? "1"),
      10
    );

    const parsedLimit = Number.parseInt(
      String(req.query.limit ?? "10"),
      10
    );

    const page = Number.isNaN(parsedPage)
      ? 1
      : Math.max(1, parsedPage);

    // Maximum 100 users per request
    const limit = Number.isNaN(parsedLimit)
      ? 10
      : Math.min(100, Math.max(1, parsedLimit));

    const result = await UserService.getAllUsers(page, limit);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};


const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUserById(id as string);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to retrieve user";

    const statusCode =
      message === "Invalid user ID" ? 400 :
      message === "User not found" ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedUser = await UserService.updateUser(
      id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    const message = error.message;

    const statusCode =
      message === "Invalid user ID" ? 400 :
      message === "User not found" ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message: message || "Failed to update user",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await UserService.deleteUser(id as string);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete user";

    const statusCode =
      message === "Invalid user ID" ? 400 :
      message === "User not found" ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

const groupUsersByInterests = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await UserService.groupUsersByInterests();

    res.status(200).json({
      success: true,
      message: "Users grouped by interests successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to group users by interests",
    });
  }
};


export const UserController = {
  getAllUsers,
    getUserById,
     updateUser,
     deleteUser,
      groupUsersByInterests,
};
