
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import User from "../user/user.model.js";



const registerUser = async (payload: RegisterInput) => {
  // 1. Check existing user
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    12
  );

  // 3. Create user
  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });

  // 4. Return safe user information
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async (payload: LoginInput) => {
  // 1. Find user by email
  const user = await User.findOne({
    email: payload.email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare password
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  // 3. Generate JWT
 
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is missing");
}

const expiresIn = (
  process.env.JWT_EXPIRES_IN || "7d"
) as NonNullable<jwt.SignOptions["expiresIn"]>;

const token = jwt.sign(
  {
    userId: user._id.toString(),
    role: user.role,
  },
  jwtSecret,
  {
    expiresIn,
  }
);

  // 4. Return token and safe user information
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};
