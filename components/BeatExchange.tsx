import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { searchSoundCloudBeats } from '../services/soundcloudService';
import { Beat, Mood, Key, AiSuggestion } from '../types';
import BeatCard from './BeatCard';
import FilterDropdown from './FilterDropdown';
import SearchBar from './SearchBar';
import AiSuggestionModal from './AiSuggestionModal';
import { LoadingSpinner, ErrorMessage, EmptyState } from './ui';
import { useModal } from '../hooks';
import { filterBeats } from '../utils/helpers';
import { FILTER_OPTIONS } from '../utils/constants';

interface BeatExchangeProps {
  currentBeat: Beat | null;
  isPlaying: boolean;
  onSelectBeat: (beat: Beat) => void;
  onBeatsLoad?: (beats: Beat[]) => void;
}

const BeatExchange: React.FC<BeatExchangeProps> = ({ currentBeat, isPlaying, onSelectBeat, onBeatsLoad }) => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModal();

  useEffect(() => {
    const fetchBeats = async () => {
      setIsLoading(true);
      setError(null);
      
      // The soundcloudService now handles API key checks and fallbacks internally,
      // simplifying the component logic.
      const fetchedBeats = await searchSoundCloudBeats('hip hop instrumental');
      
      if (fetchedBeats && fetchedBeats.length > 0) {
        setBeats(fetchedBeats);
        onBeatsLoad?.(fetchedBeats);
      } else {
        // This case is unlikely but handles a complete failure.
        setError("Could not load any beats. Please try again later.");
      }
      
      setIsLoading(false);
    };
    fetchBeats();
  }, []);


  const filteredBeats = useMemo(() => {
    return filterBeats(beats, searchTerm, selectedMood, selectedKey);
  }, [beats, searchTerm, selectedMood, selectedKey]);

  const applyAiSuggestion = useCallback((suggestion: AiSuggestion) => {
    setSelectedMood(suggestion.mood);
    setSelectedKey(suggestion.key);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleMoodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMood(e.target.value);
  }, []);

  const handleKeyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKey(e.target.value);
  }, []);
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingSpinner 
          message="Loading Beats..." 
          description="Finding the perfect instrumentals." 
        />
      );
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }
    
    if (filteredBeats.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBeats.map(beat => (
            <BeatCard 
              key={beat.id} 
              beat={beat} 
              isPlaying={currentBeat?.id === beat.id && isPlaying}
              onSelectBeat={() => onSelectBeat(beat)}
            />
          ))}
        </div>
      );
    }

    return (
      <EmptyState
        icon="fas fa-compact-disc animate-spin-slow"
        title="No Beats Found"
        description="Try adjusting your search or filters to find the perfect beat."
      />
    );
  };


  return (
    <div className="space-y-8">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-4xl font-extrabold tracking-tight">The Beat Exchange</h2>
        <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">Find the perfect instrumental for your next hit. Curated for artists.</p>
      </div>

      <div className="p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-4">
        <div className="flex-grow">
          <SearchBar value={searchTerm} onChange={handleSearchChange} />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <FilterDropdown
            label="Mood"
            options={FILTER_OPTIONS.MOOD}
            value={selectedMood}
            onChange={handleMoodChange}
          />
          <FilterDropdown
            label="Key"
            options={FILTER_OPTIONS.KEY}
            value={selectedKey}
            onChange={handleKeyChange}
          />
           <button 
             onClick={openModal}
             className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
             title="Get AI Beat Suggestion"
           >
            <i className="fas fa-magic mr-2"></i>
            <span>Suggest</span>
          </button>
        </div>
      </div>
      
      {renderContent()}

      <AiSuggestionModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        onApplySuggestion={applyAiSuggestion}
      />
    </div>
  );
};

export default BeatExchange;