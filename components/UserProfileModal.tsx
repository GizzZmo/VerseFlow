import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { Skill } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, setCurrentUser, favorites, notifications } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editSkills, setEditSkills] = useState<Skill[]>(currentUser?.skills || []);

  if (!isOpen || !currentUser) return null;

  const handleSave = () => {
    if (editName.trim()) {
      setCurrentUser({
        ...currentUser,
        name: editName.trim(),
        skills: editSkills
      });
      setIsEditing(false);
    }
  };

  const handleSkillToggle = (skill: Skill) => {
    setEditSkills(prev =>
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const allSkills = Object.values(Skill);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md text-white transform transition-all"
           onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center">
              <i className="fas fa-user-circle text-purple-400 mr-3"></i>
              User Profile
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Avatar and Basic Info */}
          <div className="text-center">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-24 h-24 rounded-full mx-auto border-4 border-purple-400 shadow-lg"
            />
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-3 text-xl font-bold bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
              />
            ) : (
              <h3 className="mt-3 text-xl font-bold">{currentUser.name}</h3>
            )}
            <p className="text-gray-400 text-sm">ID: {currentUser.id}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">{favorites.length}</div>
              <div className="text-xs text-gray-400">Favorites</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">{currentUser.skills.length}</div>
              <div className="text-xs text-gray-400">Skills</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-400">{unreadNotifications}</div>
              <div className="text-xs text-gray-400">Unread</div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-300">Skills & Talents</h4>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        editSkills.includes(skill)
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(currentUser.name);
                      setEditSkills(currentUser.skills);
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map(skill => (
                  <span key={skill} className="bg-purple-600/20 border border-purple-500/50 rounded-full px-3 py-1 text-sm font-semibold text-purple-300">
                    {skill}
                  </span>
                ))}
                {currentUser.skills.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-3 transition-colors flex items-center">
                <i className="fas fa-heart text-red-400 mr-3"></i>
                <div>
                  <div className="font-medium">View Favorites</div>
                  <div className="text-xs text-gray-400">{favorites.length} beat{favorites.length !== 1 ? 's' : ''} saved</div>
                </div>
              </button>
              <button className="w-full text-left bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-3 transition-colors flex items-center">
                <i className="fas fa-cog text-gray-400 mr-3"></i>
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-gray-400">Preferences & privacy</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;