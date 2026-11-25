
import type{ Request, Response } from "express";
import { NoteService } from "./note.service.js";


// Create Note
const createNote = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;

    const result = await NoteService.createNote(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: result,
    });
  } catch (error) {
    console.log("Create Note Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};

// Get All Notes with Pagination
const getNotes = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user!;

    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number.parseInt(String(req.query.limit ?? "10"), 10) || 10
      )
    );

    const result = await NoteService.getNotes(
      userId,
      role,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notes",
    });
  }
};

// Get Single Note
const getSingleNote = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.user!;

    const result = await NoteService.getSingleNote(
      req.params.id as string ,
      userId,
      role
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Note retrieved successfully",
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve note",
    });
  }
};

// Update Note
const updateNote = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;

    const result = await NoteService.updateNote(
      req.params.id as string,
      userId,
      req.body
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
};

// Delete Note
const deleteNote = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;

    const result = await NoteService.deleteNote(
      req.params.id as string,
      userId
    );

    if (!result) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};

export const NoteController = {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
