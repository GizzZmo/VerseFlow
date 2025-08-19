import React, { useRef, useState, useEffect } from 'react';
import { Beat } from '../types';

interface AudioPlayerProps {
  currentBeat: Beat | null;
  isPlaying: boolean;
  onPlayPause: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentBeat, isPlaying, onPlayPause }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // When no beat is selected, pause playback.
    if (!currentBeat) {
      audio.pause();
      return;
    }

    // Check if the current beat is different from the one loaded in the player.
    // Using `currentSrc` is more reliable than `src` as it gives the absolute URL of the media that's loaded.
    const isNewTrack = audio.currentSrc !== currentBeat.audioSrc;

    if (isPlaying) {
      if (isNewTrack) {
        audio.src = currentBeat.audioSrc;
        // The 'canplay' event fires when the browser has buffered enough to start playing.
        // This is a robust way to ensure we don't call play() on an unloaded source.
        const handleCanPlay = () => {
          audio.play().catch(error => {
            console.error("Audio play failed on new track:", error);
          });
        };
        
        // Add the event listener and trigger the load.
        audio.addEventListener('canplay', handleCanPlay);
        audio.load();

        // The cleanup function for this effect is crucial. It removes the event listener
        // if the selected beat changes again before the current one has finished loading.
        return () => {
          audio.removeEventListener('canplay', handleCanPlay);
        };
      } else {
        // If it's the same track, just resume playback.
        audio.play().catch(error => {
          // A play request can be interrupted by a pause. This is normal and not an error.
          if (error.name !== 'AbortError') {
            console.error("Audio resume failed:", error);
          }
        });
      }
    } else {
      // If isPlaying is false, we should always pause.
      audio.pause();
    }
  }, [currentBeat, isPlaying]);


  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setProgress(0); // Reset progress for new track
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentBeat) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/70 backdrop-blur-md border-t border-gray-700 z-50 text-white p-3 shadow-2xl">
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onPlayPause} // Pause when track ends
        crossOrigin="anonymous"
      />
      <div className="container mx-auto flex items-center space-x-4">
        <img src={currentBeat.artwork} alt={currentBeat.title} className="w-14 h-14 rounded-md object-cover" />
        <div className="flex-shrink-0 w-32 sm:w-48">
          <p className="font-bold truncate">{currentBeat.title}</p>
          <p className="text-sm text-gray-400 truncate">{currentBeat.producer}</p>
        </div>
        
        <div className="flex-grow flex items-center space-x-2 sm:space-x-4">
          <span className="text-xs text-gray-400 w-10 text-right">{formatTime(audioRef.current?.currentTime || 0)}</span>
          <div className="w-full bg-gray-600 rounded-full h-1.5 group">
             <input 
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleProgressChange}
              className="w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-gray-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:-mt-1 group-hover:[&::-webkit-slider-thumb]:bg-purple-400 transition"
            />
          </div>
          <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
        </div>

        <button onClick={onPlayPause} className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 transition-colors flex-shrink-0">
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg`}></i>
        </button>

        <div className="hidden md:flex items-center space-x-2 w-32">
          <i className="fas fa-volume-down text-gray-400"></i>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1 appearance-none bg-gray-600 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            aria-label="Volume control"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
