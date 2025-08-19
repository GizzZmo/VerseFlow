import React, { useState } from 'react';
import { CollaborationProject, Skill } from '../types';

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostProject: (projectData: { title: string; description: string; requiredSkills: Skill[] }) => void;
}

const PostProjectModal: React.FC<PostProjectModalProps> = ({ isOpen, onClose, onPostProject }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<Skill[]>([]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSkillToggle = (skill: Skill) => {
    setRequiredSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || requiredSkills.length === 0) {
      setError('Please fill out all fields and select at least one skill.');
      return;
    }
    setError('');
    onPostProject({ title, description, requiredSkills });
  };
  
  const allSkills = Object.values(Skill);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl text-white transform transition-all"
           onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center"><i className="fas fa-plus-circle text-purple-400 mr-3"></i>Post a New Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">{error}</p>}
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Project Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Seeking Vocalist for Dark Trap Banger"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project and what you're looking for..."
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      requiredSkills.includes(skill)
                        ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-700 bg-gray-900/50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full transition-colors">
              Post Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProjectModal;
