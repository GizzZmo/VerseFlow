
import React, { useState } from 'react';
import { getBeatSuggestion } from '../services/geminiService';
import { AiSuggestion } from '../types';

interface AiSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: AiSuggestion) => void;
}

const AiSuggestionModal: React.FC<AiSuggestionModalProps> = ({ isOpen, onClose, onApplySuggestion }) => {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const handleGetSuggestion = async () => {
    if (!prompt.trim()) {
      setError('Please enter a vibe or theme.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await getBeatSuggestion(prompt);
      if(result) {
        setSuggestion(result);
      } else {
         setError('Could not get a suggestion. The AI might be unavailable.');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestion) {
      onApplySuggestion(suggestion);
    }
  };
  
  const handleClose = () => {
    setPrompt('');
    setSuggestion(null);
    setError(null);
    setIsLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg text-white transform transition-all"
           onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center"><i className="fas fa-magic text-purple-400 mr-3"></i>AI Beat Suggester</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300">Describe the vibe, theme, or lyrics of your song, and let our AI suggest the perfect beat parameters.</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'A sad song about a rainy night in the city' or 'High-energy hype track for a workout'"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors h-28 resize-none"
            disabled={isLoading}
          />
          <button
            onClick={handleGetSuggestion}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Getting Suggestion...</>
            ) : (
              'Get Suggestion'
            )}
          </button>
        </div>

        {error && <div className="p-6 text-center text-red-400 bg-red-900/20">{error}</div>}

        {suggestion && (
          <div className="p-6 border-t border-gray-700 bg-gray-900/50">
             <h3 className="text-lg font-semibold text-center mb-4">AI Suggestion:</h3>
             <div className="flex justify-around items-center text-center bg-gray-700/50 p-4 rounded-lg">
                <div>
                    <p className="text-sm text-gray-400">BPM</p>
                    <p className="text-2xl font-bold text-purple-400">{suggestion.bpm}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">Key</p>
                    <p className="text-2xl font-bold text-purple-400">{suggestion.key}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">Mood</p>
                    <p className="text-2xl font-bold text-purple-400">{suggestion.mood}</p>
                </div>
             </div>
             <button onClick={handleApply} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Apply Filters
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSuggestionModal;
