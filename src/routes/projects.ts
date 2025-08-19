import express from 'express';
const router = express.Router();

// List, create, tag, and report projects
router.get('/', getProjects);
router.post('/', createProject);
router.post('/:id/tag', tagProjectSDG);
router.get('/impact', getProjectImpactReport);

export default router;