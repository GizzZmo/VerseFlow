import express from "express";
import { CollaborationProject, Skill } from "../../types";
import { MOCK_PROJECTS } from "../../constants";

const router = express.Router();

// Mock database for projects
let projects: CollaborationProject[] = [...MOCK_PROJECTS];

// GET all projects with filtering and search
router.get("/", (req, res) => {
  try {
    const { search, skills, limit = 20, offset = 0 } = req.query;
    
    let filteredProjects = [...projects];
    
    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.requiredSkills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply skills filter
    if (skills) {
      const requiredSkills = Array.isArray(skills) ? skills : [skills];
      filteredProjects = filteredProjects.filter(project =>
        requiredSkills.some(skill => project.requiredSkills.includes(skill as Skill))
      );
    }
    
    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    res.json({
      projects: paginatedProjects,
      total: filteredProjects.length,
      hasMore: endIndex < filteredProjects.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET project by ID
router.get("/:id", (req, res) => {
  try {
    const project = projects.find(p => p.id === Number(req.params.id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// CREATE new project
router.post("/", (req, res) => {
  try {
    const { title, description, requiredSkills } = req.body;
    const userId = req.user?.id;
    
    // Validation
    if (!title || !description || !requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ 
        error: 'Title, description, and requiredSkills array are required' 
      });
    }
    
    if (requiredSkills.length === 0) {
      return res.status(400).json({ 
        error: 'At least one required skill must be specified' 
      });
    }
    
    // Validate skills
    const validSkills = requiredSkills.filter(skill => Object.values(Skill).includes(skill));
    if (validSkills.length !== requiredSkills.length) {
      return res.status(400).json({ 
        error: 'Invalid skills provided' 
      });
    }
    
    const newProject: CollaborationProject = {
      id: Date.now(), // Simple ID generation for demo
      title: title.trim(),
      description: description.trim(),
      postedBy: Number(userId) || 99, // Default to demo user
      requiredSkills: validSkills
    };
    
    projects.unshift(newProject); // Add to beginning of array
    
    res.status(201).json({ 
      message: "Project created successfully", 
      project: newProject 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// UPDATE project
router.put("/:id", (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.user?.id;
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user owns the project
    if (project.postedBy !== Number(userId)) {
      return res.status(403).json({ error: 'You can only edit your own projects' });
    }
    
    const { title, description, requiredSkills } = req.body;
    
    // Update fields if provided
    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (requiredSkills && Array.isArray(requiredSkills)) {
      const validSkills = requiredSkills.filter(skill => Object.values(Skill).includes(skill));
      project.requiredSkills = validSkills;
    }
    
    res.json({ 
      message: "Project updated successfully", 
      project 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
router.delete("/:id", (req, res) => {
  try {
    const projectId = Number(req.params.id);
    const userId = req.user?.id;
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const project = projects[projectIndex];
    
    // Check if user owns the project
    if (project.postedBy !== Number(userId)) {
      return res.status(403).json({ error: 'You can only delete your own projects' });
    }
    
    projects.splice(projectIndex, 1);
    
    res.json({ 
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// GET projects by user
router.get("/user/:userId", (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const userProjects = projects.filter(p => p.postedBy === userId);
    
    res.json({
      projects: userProjects,
      total: userProjects.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user projects' });
  }
});

export default router;