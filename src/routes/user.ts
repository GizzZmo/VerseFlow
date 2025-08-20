import express from "express";
import { CurrentUser, Skill } from "../../types";

const router = express.Router();

// Mock user data - in a real app this would come from a database
const mockUsers: Record<string, CurrentUser> = {
  'demoUser': {
    id: 99,
    name: 'VerseFlow Artist',
    avatar: 'https://i.pravatar.cc/150?u=verseflow-artist',
    skills: [Skill.Rapping, Skill.Songwriting],
  },
  'user2': {
    id: 100,
    name: 'Beat Producer',
    avatar: 'https://i.pravatar.cc/150?u=beat-producer',
    skills: [Skill.Production, Skill.Mixing],
  }
};

// User favorites - in a real app this would be in a database
const userFavorites: Record<string, number[]> = {
  'demoUser': [101, 103],
  'user2': [102, 104]
};

// GET current user profile
router.get("/me", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const user = mockUsers[userId];
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const favorites = userFavorites[userId] || [];
    
    res.json({
      ...user,
      favoriteBeats: favorites,
      stats: {
        totalFavorites: favorites.length,
        skillCount: user.skills.length,
        joinDate: '2024-01-01' // Mock join date
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// GET user by ID
router.get("/:id", (req, res) => {
  try {
    const userId = req.params.id;
    const user = Object.values(mockUsers).find(u => u.id === Number(userId));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return public profile info only
    res.json({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      skills: user.skills,
      stats: {
        skillCount: user.skills.length,
        joinDate: '2024-01-01'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// UPDATE profile
router.put("/me", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const user = mockUsers[userId];
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { name, skills } = req.body;
    
    // Validate input
    if (name && typeof name !== 'string') {
      return res.status(400).json({ error: 'Name must be a string' });
    }
    
    if (skills && !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }
    
    // Update user data
    if (name) user.name = name;
    if (skills) user.skills = skills.filter(skill => Object.values(Skill).includes(skill));
    
    res.json({ 
      message: "Profile updated successfully",
      user: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET user favorites
router.get("/me/favorites", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const favorites = userFavorites[userId] || [];
    
    res.json({
      favorites,
      count: favorites.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST add to favorites
router.post("/me/favorites/:beatId", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const beatId = Number(req.params.beatId);
    
    if (!userFavorites[userId]) {
      userFavorites[userId] = [];
    }
    
    if (!userFavorites[userId].includes(beatId)) {
      userFavorites[userId].push(beatId);
    }
    
    res.json({ 
      message: 'Beat added to favorites',
      favorites: userFavorites[userId]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// DELETE remove from favorites
router.delete("/me/favorites/:beatId", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const beatId = Number(req.params.beatId);
    
    if (userFavorites[userId]) {
      userFavorites[userId] = userFavorites[userId].filter(id => id !== beatId);
    }
    
    res.json({ 
      message: 'Beat removed from favorites',
      favorites: userFavorites[userId] || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

export default router;