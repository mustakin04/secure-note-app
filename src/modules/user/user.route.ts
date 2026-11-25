
import { Router } from "express";


import { UserController } from "./user.controller.js";
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  UserController.getAllUsers
);
router.get(
  "/interests/groups",
  authenticate,
  authorize("ADMIN"),
  UserController.groupUsersByInterests
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  UserController.getUserById
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  UserController.updateUser
);


router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  UserController.deleteUser
);



export const UserRouter= router;
