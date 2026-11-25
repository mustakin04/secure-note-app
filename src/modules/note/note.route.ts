
import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { NoteController } from "./note.controller.js";



const router = Router();

// Every Note route requires authentication
router.use(authenticate);

// Create Note
router.post(
  "/",
  NoteController.createNote
);

// Get Notes with Pagination
router.get(
  "/",
  NoteController.getNotes
);

// Get Single Note
router.get(
  "/:id",
  NoteController.getSingleNote
);

// Update Note
router.patch(
  "/:id",
  NoteController.updateNote
);

// Delete Note
router.delete(
  "/:id",
  NoteController.deleteNote
);

export const NoteRouter= router;
