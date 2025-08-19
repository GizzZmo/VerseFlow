import React, { useState, useMemo } from 'react';
import { CollaborationProject, TalentProfile, CurrentUser, Skill } from '../types';
import SearchBar from './SearchBar';
import ProjectCard from './ProjectCard';
import PostProjectModal from './PostProjectModal';

const CollaborationHub: React.FC<{ currentUser: CurrentUser | null }> = ({ currentUser }) => {
  const [projects, setProjects] = useState<CollaborationProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = useMemo(() =>
    projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [projects, searchTerm]
  );

  return (
    <div>
      <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      <button onClick={() => setIsModalOpen(true)}>Post a New Project</button>
      <div>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {isModalOpen && <PostProjectModal onClose={() => setIsModalOpen(false)} onPost={proj => setProjects([proj, ...projects])} />}
    </div>
  );
};
export default CollaborationHub;