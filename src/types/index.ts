import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route.js";
import { NoteRouter } from "../modules/note/note.route.js";
import { UserRouter } from "../modules/user/user.route.js";
import { PostRoutes } from "../modules/post/post.route.js";
const router=Router()

router.use("/auth",authRouter)
router.use("/notes", NoteRouter);
router.use("/users", UserRouter);
router.use("/posts",PostRoutes)


export const IndexRoutes=router