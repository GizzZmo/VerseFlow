import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArtistProfile, CurrentUser, Skill } from '../types';
import { getArtistProfiles, getAiCollabMatch } from '../services/collaborationService';
import ArtistCard from './ArtistCard';
import SearchBar from './SearchBar';
import { LoadingSpinner, EmptyState } from './ui';

interface ArtistDirectoryProps {
  currentUser: CurrentUser | null;
}

const SKILL_OPTIONS = Object.values(Skill);

const ArtistDirectory: React.FC<ArtistDirectoryProps> = ({ currentUser }) => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [connectedIds, setConnectedIds] = useState<Set<number>>(new Set());
  const [aiMatchResult, setAiMatchResult] = useState<{ detectedGenre: string; collaborationTip: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const profiles = await getArtistProfiles();
      setArtists(profiles);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSkillChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSkill(e.target.value);
  }, []);

  const handleRequestSent = useCallback((artistId: number) => {
    setConnectedIds(prev => new Set(prev).add(artistId));
  }, []);

  // connectedIds is used to prevent re-sending requests after the page re-renders
  const isConnected = useCallback((artistId: number) => connectedIds.has(artistId), [connectedIds]);

  const handleAiMatch = useCallback(async () => {
    if (!currentUser) return;
    setIsAiLoading(true);
    const result = await getAiCollabMatch(
      currentUser.skills,
      `Looking for collaborators with skills: ${currentUser.skills.join(', ')}`
    );
    setAiMatchResult(result);
    setIsAiLoading(false);
  }, [currentUser]);

  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      const matchesSearch =
        searchTerm === '' ||
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSkill =
        selectedSkill === 'all' ||
        artist.skills.includes(selectedSkill as Skill);

      return matchesSearch && matchesSkill;
    });
  }, [artists, searchTerm, selectedSkill]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-4xl font-extrabold tracking-tight">Artist Directory</h2>
        <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
          Find musicians, rappers, producers, and engineers to collaborate with.
        </p>
      </div>

      {/* AI Match tip */}
      {currentUser && (
        <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-grow">
            {aiMatchResult ? (
              <div>
                <p className="text-indigo-300 font-semibold text-sm">
                  <i className="fas fa-robot mr-2"></i>AI Match ({aiMatchResult.detectedGenre})
                </p>
                <p className="text-gray-300 text-sm mt-1">{aiMatchResult.collaborationTip}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                <i className="fas fa-magic mr-2 text-indigo-400"></i>
                Let AI suggest the best collaborators for your skill set.
              </p>
            )}
          </div>
          <button
            onClick={handleAiMatch}
            disabled={isAiLoading}
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-2 px-5 rounded-full text-sm transition-colors"
          >
            {isAiLoading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Analyzing...</>
            ) : (
              <><i className="fas fa-magic mr-2"></i>Match Me</>
            )}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <SearchBar value={searchTerm} onChange={handleSearchChange} />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400 whitespace-nowrap">Filter by Skill:</label>
          <select
            value={selectedSkill}
            onChange={handleSkillChange}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Skills</option>
            {SKILL_OPTIONS.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-500 whitespace-nowrap">
          {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner message="Loading Artists..." description="Discovering your next collaborator." />
      ) : filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map(artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              currentUser={currentUser}
              onRequestSent={handleRequestSent}
              requestSent={isConnected(artist.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="fas fa-user-slash"
          title="No Artists Found"
          description="Try a different search or skill filter."
        />
      )}
    </div>
  );
};

export default ArtistDirectory;
