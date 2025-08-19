import express from "express";
const router = express.Router();

// GET all SDG tags
router.get("/", (req, res) => {
  res.json(["No Poverty", "Quality Education", "Gender Equality"]);
});

export default router;