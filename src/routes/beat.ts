import express from "express";
import { Beat } from "../../types";
import { MOCK_SOUNDCLOUD_API_RESPONSE } from "../../constants";
import { mapSoundCloudTrackToBeat } from "../../services/soundcloudService";

const router = express.Router();

// Mock database for demonstration
let beats: Beat[] = MOCK_SOUNDCLOUD_API_RESPONSE.map((track, index) => 
  mapSoundCloudTrackToBeat(track, null, true)
).filter(Boolean) as Beat[];

// GET all beats/assets with filtering and search
router.get("/", (req, res) => {
  try {
    const { search, mood, key, limit = 20, offset = 0 } = req.query;
    
    let filteredBeats = [...beats];
    
    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredBeats = filteredBeats.filter(beat => 
        beat.title.toLowerCase().includes(searchLower) ||
        beat.producer.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply mood filter
    if (mood && mood !== 'all') {
      filteredBeats = filteredBeats.filter(beat => beat.mood === mood);
    }
    
    // Apply key filter
    if (key && key !== 'all') {
      filteredBeats = filteredBeats.filter(beat => beat.key === key);
    }
    
    // Apply pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedBeats = filteredBeats.slice(startIndex, endIndex);
    
    res.json({
      beats: paginatedBeats,
      total: filteredBeats.length,
      hasMore: endIndex < filteredBeats.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beats' });
  }
});

// GET beat by ID
router.get("/:id", (req, res) => {
  try {
    const beat = beats.find(b => b.id === Number(req.params.id));
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }
    res.json(beat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beat' });
  }
});

// POST favorite/unfavorite beat
router.post("/:id/favorite", (req, res) => {
  try {
    const beatId = Number(req.params.id);
    const beat = beats.find(b => b.id === beatId);
    
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }
    
    // In a real app, this would be stored in a user favorites table
    // For now, we'll just return success
    res.json({ 
      message: 'Beat favorited successfully',
      beatId,
      isFavorited: true 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to favorite beat' });
  }
});

// DELETE unfavorite beat
router.delete("/:id/favorite", (req, res) => {
  try {
    const beatId = Number(req.params.id);
    res.json({ 
      message: 'Beat unfavorited successfully',
      beatId,
      isFavorited: false 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfavorite beat' });
  }
});

// UPLOAD beat/asset
router.post("/", (req, res) => {
  try {
    const { title, producer, bpm, key, mood } = req.body;
    
    if (!title || !producer) {
      return res.status(400).json({ error: 'Title and producer are required' });
    }
    
    const newBeat: Beat = {
      id: Date.now(), // Simple ID generation for demo
      title,
      producer,
      artwork: `https://picsum.photos/seed/${Date.now()}/500/500`,
      bpm: bpm || Math.floor(Math.random() * (160 - 80 + 1)) + 80,
      key: key || 'Cmaj',
      mood: mood || 'Chill',
      leasePrice: parseFloat((Math.random() * (39.99 - 19.99) + 19.99).toFixed(2)),
      exclusivePrice: parseFloat((Math.random() * (499.99 - 249.99) + 249.99).toFixed(2)),
      audioSrc: 'https://storage.googleapis.com/vsl-assets/kh/_sample_music/lofi-1.mp3'
    };
    
    beats.unshift(newBeat); // Add to beginning of array
    
    res.status(201).json({ 
      message: "Beat uploaded successfully", 
      beat: newBeat 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload beat' });
  }
});

export default router;