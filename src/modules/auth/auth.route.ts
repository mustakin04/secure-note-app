
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import {  loginSchema, registerSchema } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";


const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(loginSchema),
  AuthController.login
);
// Protected route
router.get(
  "/me",
  authenticate,
  AuthController.getCurrentUser
);

export const authRouter = router;
