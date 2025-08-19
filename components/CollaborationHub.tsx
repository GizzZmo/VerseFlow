import React, { useState, useMemo } from 'react';
import { MOCK_PROJECTS, MOCK_TALENT_PROFILES } from '../constants';
import { CollaborationProject, TalentProfile, CurrentUser, Skill } from '../types';
import SearchBar from './SearchBar';
import ProjectCard from './ProjectCard';
import PostProjectModal from './PostProjectModal';

interface CollaborationHubProps {
  currentUser: CurrentUser | null;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ currentUser }) => {
  const [projects, setProjects] = useState<CollaborationProject[]>(MOCK_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // In a real app, this would be a more efficient lookup, perhaps from a context or a store.
  const talentMap = useMemo(() => {
    const allProfiles = [...MOCK_TALENT_PROFILES];
    if (currentUser && !MOCK_TALENT_PROFILES.find(p => p.id === currentUser.id)) {
        allProfiles.push(currentUser);
    }

    return allProfiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<number, TalentProfile>);
  }, [currentUser]);

  const handlePostProject = (projectData: { title: string; description: string; requiredSkills: Skill[] }) => {
    if (!currentUser) return;
    const newProject: CollaborationProject = {
      ...projectData,
      id: Date.now(), // Use a simple unique ID for demonstration
      postedBy: currentUser.id,
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
    setIsModalOpen(false);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const lowercasedTerm = searchTerm.toLowerCase();
      const matchesTitle = project.title.toLowerCase().includes(lowercasedTerm);
      const matchesDescription = project.description.toLowerCase().includes(lowercasedTerm);
      const matchesSkills = project.requiredSkills.some(skill => skill.toLowerCase().includes(lowercasedTerm));
      
      return matchesTitle || matchesDescription || matchesSkills;
    });
  }, [projects, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-4xl font-extrabold tracking-tight">The Cypher</h2>
        <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">The Collaboration Hub. Find your next creative partner.</p>
      </div>
      
      <div className="p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 md:flex md:items-center md:justify-between gap-4">
        <div className="flex-grow mb-4 md:mb-0">
            <SearchBar 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
        </div>
        {currentUser && (
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto flex-shrink-0 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center justify-center"
            >
                <i className="fas fa-plus-circle mr-2"></i>
                Post a New Project
            </button>
        )}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const artist = talentMap[project.postedBy];
            return <ProjectCard key={project.id} project={project} artist={artist} />;
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
          <i className="fas fa-users-slash text-5xl text-gray-500"></i>
          <h3 className="mt-4 text-xl font-semibold text-white">No Matching Projects</h3>
          <p className="mt-1 text-gray-400">Try a different search term to find a collaboration.</p>
        </div>
      )}
      
      {currentUser && (
        <PostProjectModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPostProject={handlePostProject}
        />
      )}

    </div>
  );
};

export default CollaborationHub;
