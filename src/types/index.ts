import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route.js";
import { NoteRouter } from "../modules/note/note.route.js";
const router=Router()

router.use("/auth",authRouter)
router.use("/notes", NoteRouter);



export const IndexRoutes=router