const auth = require("../middleware/auth");
const express = require("express");
const Student = require("../models/Student");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET one student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(404).json({
      error: "Invalid student ID"
    });
  }
});

// POST student
router.post("/",auth, async (req, res) => {
  try {
    const created = await Student.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// PATCH student
router.patch("/:id",auth, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// DELETE student
router.delete("/:id",auth, requireRole("admin"), async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: "Invalid student ID"
    });
  }
});

module.exports = router;