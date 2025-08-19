
import React from 'react';
import { Beat } from '../types';

interface BeatCardProps {
  beat: Beat;
  isPlaying: boolean;
  onSelectBeat: () => void;
}

const BeatCard: React.FC<BeatCardProps> = React.memo(({ beat, isPlaying, onSelectBeat }) => {
  const cardClasses = `bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700/50 group transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 ${isPlaying ? 'border-purple-500 shadow-purple-500/30 ring-2 ring-purple-500' : ''}`;

  return (
    <div className={cardClasses}>
      <div className="relative">
        <img src={beat.artwork} alt={beat.title} className="w-full h-48 object-cover" />
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button 
            onClick={onSelectBeat} 
            className="w-16 h-16 bg-purple-600/80 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors"
            aria-label={isPlaying ? `Pause ${beat.title}` : `Play ${beat.title}`}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-2xl`}></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate text-white">{beat.title}</h3>
        <p className="text-sm text-gray-400">{beat.producer}</p>
        <div className="flex justify-between items-center text-xs text-gray-300 mt-2">
          <span><i className="fas fa-tachometer-alt mr-1 text-purple-400"></i>{beat.bpm} BPM</span>
          <span><i className="fas fa-key mr-1 text-purple-400"></i>{beat.key}</span>
        </div>
        <div className="mt-2">
            <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-purple-300 mr-2 mb-2">
                #{beat.mood}
            </span>
        </div>
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors">
            Lease <span className="font-normal opacity-75">${beat.leasePrice}</span>
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors">
            Exclusive <span className="font-normal opacity-75">${beat.exclusivePrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

BeatCard.displayName = 'BeatCard';

export default BeatCard;
