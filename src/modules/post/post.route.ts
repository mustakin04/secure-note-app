import { Router } from "express";
import { PostController } from "./post.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";


const router = Router();

router.get(
  "/",
  authenticate,
  PostController.createPost
);


router.get(
  "/:userId/posts",
  authenticate,
  PostController.getUserPosts
);

export const PostRoutes = router;