import express from "express";
const router = express.Router();

// GET all projects
router.get("/", (req, res) => {
  // TODO: Fetch from DB
  res.json([{ id: 1, title: "Collab Song", sdgTags: ["Quality Education"] }]);
});

// CREATE new project
router.post("/", (req, res) => {
  // TODO: Validate & save to DB
  res.status(201).json({ msg: "Project created", data: req.body });
});

// TAG project with SDG
router.post("/:id/tag", (req, res) => {
  // TODO: Update project tags in DB
  res.json({ msg: "SDG tag added", sdg: req.body.sdg });
});

export default router;