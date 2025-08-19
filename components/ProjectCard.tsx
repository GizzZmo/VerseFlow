import React from 'react';
import { CollaborationProject, TalentProfile } from '../types';

interface ProjectCardProps {
  project: CollaborationProject;
  artist: TalentProfile;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, artist }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 group flex flex-col h-full transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 h-20 overflow-hidden text-ellipsis">
          {project.description}
        </p>
        
        <div className="mb-4">
          <h4 className="text-xs uppercase text-gray-500 font-semibold mb-2">Skills Needed</h4>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map(skill => (
              <span key={skill} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-purple-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-5 border-t border-gray-700 bg-gray-800/50 mt-auto">
         <div className="flex items-center justify-between">
            <div className="flex items-center">
                <img src={artist.avatar} alt={artist.name} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-600" />
                <div>
                    <p className="text-sm text-gray-400">Posted by</p>
                    <p className="font-semibold text-white">{artist.name}</p>
                </div>
            </div>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm">
              View
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
