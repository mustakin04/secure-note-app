import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";


const register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    const message = error.message;

    const statusCode =
      message === "Invalid email or password" ? 401 : 500;

    res.status(statusCode).json({
      success: false,
      message: statusCode === 401
        ? "Invalid email or password"
        : "Login failed",
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    data: req.user,
  });
};


export const AuthController = {
  register,
  login,
   getCurrentUser,
};
