import express from "express";
const router = express.Router();

// GET current user profile
router.get("/me", (req, res) => {
  res.json({ id: req.user.id, name: "Demo User", skills: ["producer", "songwriter"] });
});

// GET user by ID
router.get("/:id", (req, res) => {
  // TODO: Fetch user by ID from DB
  res.json({ id: req.params.id, name: "Other User" });
});

// UPDATE profile
router.put("/me", (req, res) => {
  // TODO: Update user profile in DB
  res.json({ msg: "Profile updated" });
});

export default router;