import React, { useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import BeatCard from './BeatCard';
import { Beat } from '../types';

interface FavoritesViewProps {
  beats: Beat[];
  currentBeat: Beat | null;
  isPlaying: boolean;
  onSelectBeat: (beat: Beat) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  beats, 
  currentBeat, 
  isPlaying, 
  onSelectBeat 
}) => {
  const { favorites } = useUser();

  const favoriteBeats = useMemo(() => {
    return beats.filter(beat => favorites.includes(beat.id));
  }, [beats, favorites]);

  if (favoriteBeats.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
        <i className="fas fa-heart text-5xl text-gray-500 mb-4"></i>
        <h3 className="text-xl font-semibold text-white mb-2">No Favorites Yet</h3>
        <p className="text-gray-400">
          Start exploring beats and add some to your favorites by clicking the heart icon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          <i className="fas fa-heart text-purple-400 mr-3"></i>
          Your Favorites
        </h2>
        <p className="text-gray-400">
          {favoriteBeats.length} beat{favoriteBeats.length !== 1 ? 's' : ''} in your collection
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteBeats.map(beat => (
          <BeatCard 
            key={beat.id} 
            beat={beat} 
            isPlaying={currentBeat?.id === beat.id && isPlaying}
            onSelectBeat={() => onSelectBeat(beat)}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;