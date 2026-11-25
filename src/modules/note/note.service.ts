import Note from "./note.model.js";

interface NotePayload {
  title: string;
  content: string;
}

type UserRole = "USER" | "ADMIN";

// Create Note
const createNote = async (
  userId: string,
  payload: NotePayload
) => {
  return await Note.create({
    ...payload,
    user: userId,
  });
};

// Get Notes with Pagination
const getNotes = async (
  userId: string,
  role: UserRole,
  page: number,
  limit: number
) => {
  const filter = role === "ADMIN" ? {} : { user: userId };

  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit),

    Note.countDocuments(filter),
  ]);

  return {
    notes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Single Note
const getSingleNote = async (
  noteId: string,
  userId: string,
  role: UserRole
) => {
  const filter =
    role === "ADMIN"
      ? { _id: noteId }
      : { _id: noteId, user: userId };

  return await Note.findOne(filter);
};

// Update Own Note
const updateNote = async (
  noteId: string,
  userId: string,
  payload: Partial<NotePayload>
) => {
  return await Note.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
    },
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete Own Note
const deleteNote = async (
  noteId: string,
  userId: string
) => {
  return await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
  });
};

export const NoteService = {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
