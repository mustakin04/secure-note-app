import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";

interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Step 1: Authorization header থেকে Token নেওয়া
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });
      return;
    }

    // Step 2: JWT Secret যাচাই
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT configuration error",
      });
      return;
    }

    // Step 3: Token Verify
    let decoded: JwtPayload;

    try {
      const verified = jwt.verify(token, jwtSecret);

      if (typeof verified === "string" || typeof verified.userId !== "string") {
        res.status(401).json({
          success: false,
          message: "Invalid token",
        });
        return;
      }

      decoded = verified as JwtPayload;
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    // Step 4: Database থেকে User খুঁজে বের করা
    const user = await User.findById(decoded.userId).select("_id role");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
      return;
    }

    // Step 5: Request-এর মধ্যে User তথ্য রাখা
    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: ("USER" | "ADMIN")[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission",
      });
      return;
    }

    next();
  };
};
