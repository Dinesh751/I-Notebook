const Notes = require("../models/Notes");
const fetchnotes = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const express = require("express");

const router = express.Router();

// Route:1   get the all notes by using getmethod ("/getnotes")  :login Required
router.get("/getnotes", fetchnotes, async (req, res) => {
  try {
    const note = await Notes.find({ userId: req.user.id });
    res.send(note);
  } catch (err) {
    res.send("Internal Error");
  }
});

// Route:2  create a notes by using post method("/createnotes")  :loginRequired

router.post(
  "/createnotes",
  [
    body("title", "Enter valid title").isLength({ min: 2 }),
    body("description", "enter valid description").isLength({ min: 5 }),
    body("tag", "Enter valid tag")
  ],
  fetchnotes,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // create a notes
      let notes = await Notes.create({
        userId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });

      res.json({ notes });

      // catch the error
    } catch (err) {
      console.error(err.message);
      res.status(500).send("error occured");
    }
  }
);

// Route:3 update the note using put menthod:  ("/notes/updatenotes")    login required

router.put("/updatenotes/:id", fetchnotes, async (req, res) => {
  let notes = await Notes.findById(req.params.id);
  if (!notes) {
    return res.status(404).send("file not found");
  }
  if (notes.userId.toString() !== req.user.id) {
    return res.status(404).send("Not allowed");
  }
  
  let { title, description, tag } = req.body;
  newNotes = {};

  if (title) {
    newNotes.title = title;
  }
  if (description) {
    newNotes.description = description;
  }
  if (tag) {
    newNotes.tag = tag;
  }

  try {
    newNote = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNotes },
      { new: true }
    );
    res.send(newNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("error occured");
  }
});

// Route:4 delete the note using DELETE menthod:  ("/notes/updatenotes")    login required

router.delete("/deletenote/:id", fetchnotes, async (req, res) => {
  let notes = await Notes.findById(req.params.id);
  if (!notes) {
    return res.status(404).send("file not found");
  }
  if (notes.userId.toString() !== req.user.id) {
    return res.status(404).send("Not allowed");
  }
 

  try {
    newNote = await Notes.findByIdAndDelete(req.params.id);
    res.status(200).send("succesfully deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("error occured");
  }
});

module.exports = router;
