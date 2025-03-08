const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const Note = require("../../../infrastructure/models/NoteModel");

// Route 1: Get all notes using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route 2: Add a new note using: POST "/api/notes/addnote". Login required
router.post("/addnote", protect, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const note = new Note({
      title,
      description,
      tag,
      user: req.user._id,
    });
    const savedNote = await note.save();
    res.json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route 3: Update an existing note using: PUT "/api/notes/updatenote/:id". Login required
router.put("/updatenote/:id", protect, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not allowed" });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route 4: Delete an existing note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete("/deletenote/:id", protect, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not allowed" });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted", note });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
