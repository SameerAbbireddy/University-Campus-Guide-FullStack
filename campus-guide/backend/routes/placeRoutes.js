const express = require("express");
const router = express.Router();

const {
  createPlace,
  getPlaces,
  updatePlace,
  deletePlace,
} = require("../controllers/placeController");

const protect = require("../middleware/authMiddleware");

router.get("/", getPlaces);
router.post("/", protect, createPlace);
router.put("/:id", protect, updatePlace);
router.delete("/:id", protect, deletePlace);

module.exports = router;