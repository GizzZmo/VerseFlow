import express from "express";
const router = express.Router();

// GET impact analytics (e.g., per SDG, collaborations count)
router.get("/impact", (req, res) => {
  res.json({
    "Quality Education": 12,
    "Gender Equality": 8,
    "No Poverty": 3,
    totalCollaborations: 23,
    uniqueCountries: 17
  });
});

export default router;