import React, { useState, useCallback } from 'react';
import { CollaborationProject, Skill } from '../types';
import { BaseModal, Button, FormInput, FormTextarea } from './ui';

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostProject: (projectData: { title: string; description: string; requiredSkills: Skill[] }) => void;
}

const ALL_SKILLS = Object.values(Skill);

const PostProjectModal: React.FC<PostProjectModalProps> = ({ isOpen, onClose, onPostProject }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<Skill[]>([]);
  const [error, setError] = useState('');

  const handleSkillToggle = useCallback((skill: Skill) => {
    setRequiredSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || requiredSkills.length === 0) {
      setError('Please fill out all fields and select at least one skill.');
      return;
    }
    setError('');
    onPostProject({ title, description, requiredSkills });
    handleClose();
  }, [title, description, requiredSkills, onPostProject]);
  
  const handleClose = useCallback(() => {
    setTitle('');
    setDescription('');
    setRequiredSkills([]);
    setError('');
    onClose();
  }, [onClose]);
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Post a New Project"
      icon="fas fa-plus-circle"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <p className="text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">
              {error}
            </p>
          )}
          
          <FormInput
            label="Project Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Seeking Vocalist for Dark Trap Banger"
          />

          <FormTextarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project and what you're looking for..."
            className="h-32"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map(skill => (
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
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded-full"
          >
            Post Project
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default PostProjectModal;
