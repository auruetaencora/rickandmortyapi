const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");
const { validateNumberParam } = require("../middlewares/validateParams");

router.get("/get/:number", validateNumberParam, async (req, res) => {
  try {
    await characterController.getAndSaveCharacters(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/sort", async (req, res) => {
  try {
    await characterController.readAndSortCharacters(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await characterController.deleteCharacter(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/alter", async (req, res) => {
  try {
    const { type } = req.body;
    if (type === "undo") {
      await characterController.undoDelete(req, res);
    } else if (type === "redo") {
      await characterController.redoDelete(req, res);
    } else {
      res.status(400).json({ error: "Invalid type. Use 'undo' or 'redo'." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
