import express from "express";
const router = express.Router();

// GET notifications for user
router.get("/", (req, res) => {
  // TODO: Fetch from DB
  res.json([{ id: "n1", message: "You have a new collab request!", read: false }]);
});

// MARK as read
router.post("/:id/read", (req, res) => {
  // TODO: Update notification in DB
  res.json({ msg: "Notification marked as read" });
});

export default router;