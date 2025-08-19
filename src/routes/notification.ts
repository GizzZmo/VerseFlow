import express from "express";

const router = express.Router();

// Notification interface
interface Notification {
  id: string;
  userId: string;
  type: 'project_interest' | 'beat_favorite' | 'profile_view' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

// Mock notification storage
const notifications: Record<string, Notification[]> = {
  'demoUser': [
    {
      id: 'n1',
      userId: 'demoUser',
      type: 'project_interest',
      title: 'New Project Interest',
      message: 'Someone is interested in your "Hip-Hop Collab" project!',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'n2',
      userId: 'demoUser',
      type: 'beat_favorite',
      title: 'Beat Favorited',
      message: 'Your beat "Urban Groove" was favorited by another user!',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 'n3',
      userId: 'demoUser',
      type: 'system',
      title: 'Welcome to VerseFlow!',
      message: 'Start exploring beats and finding collaborators.',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
  ]
};

// GET notifications for user
router.get("/", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const userNotifications = notifications[userId] || [];
    
    // Sort by creation date (newest first)
    const sortedNotifications = userNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    res.json({
      notifications: sortedNotifications,
      unreadCount,
      total: sortedNotifications.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET unread count only
router.get("/unread-count", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const userNotifications = notifications[userId] || [];
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// MARK specific notification as read
router.post("/:id/read", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const notificationId = req.params.id;
    const userNotifications = notifications[userId];
    
    if (!userNotifications) {
      return res.status(404).json({ error: 'User has no notifications' });
    }
    
    const notification = userNotifications.find(n => n.id === notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notification.read = true;
    
    res.json({ 
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// MARK all notifications as read
router.post("/read-all", (req, res) => {
  try {
    const userId = req.user?.id || 'demoUser';
    const userNotifications = notifications[userId];
    
    if (!userNotifications) {
      return res.status(404).json({ error: 'User has no notifications' });
    }
    
    userNotifications.forEach(notification => {
      notification.read = true;
    });
    
    res.json({ 
      message: "All notifications marked as read",
      count: userNotifications.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// CREATE new notification (for system use)
router.post("/", (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;
    
    if (!userId || !type || !title || !message) {
      return res.status(400).json({ 
        error: 'userId, type, title, and message are required' 
      });
    }
    
    const newNotification: Notification = {
      id: `n_${Date.now()}`,
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      data
    };
    
    if (!notifications[userId]) {
      notifications[userId] = [];
    }
    
    notifications[userId].unshift(newNotification);
    
    res.status(201).json({ 
      message: "Notification created successfully",
      notification: newNotification
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

export default router;