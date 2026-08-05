import express from "express";
import { CollaborationRequest, Message } from "../../types";

const router = express.Router();

// In-memory store (replace with DB in production)
let collaborationRequests: CollaborationRequest[] = [];
let messages: Message[] = [];
let nextId = 2000;

// ---------------------------------------------------------------------------
// Collaboration Requests
// ---------------------------------------------------------------------------

// GET all requests for a user
router.get("/requests", (req, res) => {
  try {
    const userId = Number(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: "userId query param required" });
    }
    const userRequests = collaborationRequests.filter(
      r => r.fromUserId === userId || r.toUserId === userId
    );
    res.json(userRequests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// POST create new collaboration request
router.post("/requests", (req, res) => {
  try {
    const { fromUserId, toUserId, message, projectId } = req.body;

    if (!fromUserId || !toUserId || !message) {
      return res.status(400).json({ error: "fromUserId, toUserId and message are required" });
    }

    // Prevent duplicate pending requests
    const existing = collaborationRequests.find(
      r =>
        r.fromUserId === fromUserId &&
        r.toUserId === toUserId &&
        r.status === "pending"
    );
    if (existing) {
      return res.status(409).json({ error: "A pending request already exists", request: existing });
    }

    const newRequest: CollaborationRequest = {
      id: ++nextId,
      fromUserId: Number(fromUserId),
      toUserId: Number(toUserId),
      projectId: projectId ? Number(projectId) : undefined,
      message: String(message),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    collaborationRequests.push(newRequest);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

// PATCH respond to a request (accept / decline)
router.patch("/requests/:id", (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const { status } = req.body;

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ error: "status must be 'accepted' or 'declined'" });
    }

    const request = collaborationRequests.find(r => r.id === requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = status;
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to update request" });
  }
});

// ---------------------------------------------------------------------------
// Direct Messages
// ---------------------------------------------------------------------------

// GET messages between two users
router.get("/messages", (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const otherUserId = Number(req.query.otherUserId);

    if (!userId || !otherUserId) {
      return res.status(400).json({ error: "userId and otherUserId query params required" });
    }

    const thread = messages.filter(
      m =>
        (m.fromUserId === userId && m.toUserId === otherUserId) ||
        (m.fromUserId === otherUserId && m.toUserId === userId)
    );

    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST send a message
router.post("/messages", (req, res) => {
  try {
    const { fromUserId, toUserId, content } = req.body;

    if (!fromUserId || !toUserId || !content) {
      return res.status(400).json({ error: "fromUserId, toUserId, and content are required" });
    }

    const message: Message = {
      id: ++nextId,
      fromUserId: Number(fromUserId),
      toUserId: Number(toUserId),
      content: String(content),
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.push(message);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// PATCH mark message as read
router.patch("/messages/:id/read", (req, res) => {
  try {
    const messageId = Number(req.params.id);
    const message = messages.find(m => m.id === messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    message.read = true;
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

export default router;
