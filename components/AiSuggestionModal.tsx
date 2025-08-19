
import React, { useState, useCallback } from 'react';
import { getBeatSuggestion } from '../services/geminiService';
import { AiSuggestion } from '../types';
import { BaseModal, Button, FormTextarea } from './ui';
import { useAsyncOperation } from '../hooks';

interface AiSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion: (suggestion: AiSuggestion) => void;
}

const AiSuggestionModal: React.FC<AiSuggestionModalProps> = ({ isOpen, onClose, onApplySuggestion }) => {
  const [prompt, setPrompt] = useState('');
  const { data: suggestion, isLoading, error, execute, reset } = useAsyncOperation<AiSuggestion>();

  const handleGetSuggestion = useCallback(async () => {
    if (!prompt.trim()) {
      return;
    }
    
    await execute(async () => {
      const result = await getBeatSuggestion(prompt);
      if (!result) {
        throw new Error('Could not get a suggestion. The AI might be unavailable.');
      }
      return result;
    });
  }, [prompt, execute]);

  const handleApply = useCallback(() => {
    if (suggestion) {
      onApplySuggestion(suggestion);
      handleClose();
    }
  }, [suggestion, onApplySuggestion]);
  
  const handleClose = useCallback(() => {
    setPrompt('');
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="AI Beat Suggester"
      icon="fas fa-magic"
    >
      <div className="p-6 space-y-4">
        <p className="text-gray-300">
          Describe the vibe, theme, or lyrics of your song, and let our AI suggest the perfect beat parameters.
        </p>
        
        <FormTextarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A sad song about a rainy night in the city' or 'High-energy hype track for a workout'"
          className="h-28"
          disabled={isLoading}
          error={!prompt.trim() && error ? 'Please enter a vibe or theme.' : undefined}
        />
        
        <Button
          onClick={handleGetSuggestion}
          disabled={!prompt.trim()}
          isLoading={isLoading}
          className="w-full"
        >
          Get Suggestion
        </Button>
      </div>

      {error && (
        <div className="p-6 text-center text-red-400 bg-red-900/20">
          {error}
        </div>
      )}

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
          <Button
            onClick={handleApply}
            variant="success"
            className="mt-4 w-full"
          >
            Apply Filters
          </Button>
        </div>
      )}
    </BaseModal>
  );
};

export default AiSuggestionModal;
