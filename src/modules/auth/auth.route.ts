
import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { loginValidationSchema, registerValidationSchema } from "./auth.validation.js";
import { AuthController } from "./auth.controller.js";


const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  AuthController.login
);

export const authRouter = router;
