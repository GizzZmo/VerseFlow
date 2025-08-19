import express from "express";
const router = express.Router();

// GET all beats/assets
router.get("/", (req, res) => {
  res.json([{ id: "b1", title: "Urban Beat", bpm: 90 }]);
});

// UPLOAD beat/asset
router.post("/", (req, res) => {
  // TODO: Validate & save beat
  res.status(201).json({ msg: "Beat uploaded", data: req.body });
});

export default router;