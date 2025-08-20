import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Beat, CurrentUser } from '../types';

interface UserContextType {
  currentUser: CurrentUser | null;
  favorites: number[];
  notifications: Notification[];
  setCurrentUser: (user: CurrentUser | null) => void;
  addToFavorites: (beatId: number) => void;
  removeFromFavorites: (beatId: number) => void;
  isFavorite: (beatId: number) => boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadCount: () => number;
}

interface Notification {
  id: string;
  type: 'favorite' | 'collaboration' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'system',
      title: 'Welcome to VerseFlow!',
      message: 'Start exploring beats and connecting with other artists.',
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('verseflow_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('verseflow_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (beatId: number) => {
    if (!favorites.includes(beatId)) {
      setFavorites(prev => [...prev, beatId]);
      addNotification({
        type: 'favorite',
        title: 'Beat Favorited',
        message: 'Beat has been added to your favorites.',
        read: false
      });
    }
  };

  const removeFromFavorites = (beatId: number) => {
    setFavorites(prev => prev.filter(id => id !== beatId));
  };

  const isFavorite = (beatId: number) => {
    return favorites.includes(beatId);
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const value: UserContextType = {
    currentUser,
    favorites,
    notifications,
    setCurrentUser,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addNotification,
    markNotificationAsRead,
    getUnreadCount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};