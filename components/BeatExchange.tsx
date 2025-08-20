import React, { useState, useMemo, useEffect } from 'react';
import { searchSoundCloudBeats } from '../services/soundcloudService';
import { Beat, Mood, Key, AiSuggestion } from '../types';
import BeatCard from './BeatCard';
import FilterDropdown from './FilterDropdown';
import SearchBar from './SearchBar';
import AiSuggestionModal from './AiSuggestionModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return beats.filter(beat => {
      const matchesSearch = beat.title.toLowerCase().includes(searchTerm.toLowerCase()) || beat.producer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = selectedMood === 'all' || beat.mood === selectedMood;
      const matchesKey = selectedKey === 'all' || beat.key === selectedKey;
      return matchesSearch && matchesMood && matchesKey;
    });
  }, [beats, searchTerm, selectedMood, selectedKey]);

  const applyAiSuggestion = (suggestion: AiSuggestion) => {
    setSelectedMood(suggestion.mood);
    setSelectedKey(suggestion.key);
    // You could also adjust a BPM slider here if you had one
    setIsModalOpen(false);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
          <i className="fas fa-spinner fa-spin text-5xl text-purple-400"></i>
          <h3 className="mt-4 text-xl font-semibold text-white">Loading Beats...</h3>
          <p className="mt-1 text-gray-400">Finding the perfect instrumentals.</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="text-center py-16 px-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <i className="fas fa-exclamation-triangle text-5xl text-red-400"></i>
          <h3 className="mt-4 text-xl font-semibold text-white">Something Went Wrong</h3>
          <p className="mt-1 text-red-300">{error}</p>
        </div>
      );
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
       <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
          <i className="fas fa-compact-disc text-5xl text-gray-500 animate-spin-slow"></i>
          <h3 className="mt-4 text-xl font-semibold text-white">No Beats Found</h3>
          <p className="mt-1 text-gray-400">Try adjusting your search or filters to find the perfect beat.</p>
        </div>
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
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <FilterDropdown
            label="Mood"
            options={Object.values(Mood)}
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
          />
          <FilterDropdown
            label="Key"
            options={Object.values(Key)}
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
          />
           <button 
             onClick={() => setIsModalOpen(true)}
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
        onClose={() => setIsModalOpen(false)}
        onApplySuggestion={applyAiSuggestion}
      />
    </div>
  );
};

export default BeatExchange;