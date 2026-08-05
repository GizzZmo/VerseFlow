import React, { useState, useCallback } from 'react';
import { ArtistProfile, CurrentUser } from '../types';
import { sendCollaborationRequest } from '../services/collaborationService';

interface ArtistCardProps {
  artist: ArtistProfile;
  currentUser: CurrentUser | null;
  onRequestSent?: (artistId: number) => void;
  requestSent?: boolean;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, currentUser, onRequestSent, requestSent = false }) => {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(requestSent ? 'sent' : 'idle');

  const isOwnProfile = currentUser?.id === artist.id;

  const handleConnect = useCallback(async () => {
    if (!currentUser || isOwnProfile || !message.trim()) return;
    setStatus('sending');
    try {
      await sendCollaborationRequest(currentUser.id, artist.id, message.trim());
      setStatus('sent');
      setMessage('');
      setShowMessageBox(false);
      onRequestSent?.(artist.id);
    } catch {
      setStatus('error');
    }
  }, [currentUser, artist.id, message, isOwnProfile, onRequestSent]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
      <div className="p-5 flex-grow">
        {/* Avatar + name */}
        <div className="flex items-center mb-4">
          <img
            src={artist.avatar}
            alt={artist.name}
            className="w-14 h-14 rounded-full border-2 border-purple-500 mr-4 object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-white">{artist.name}</h3>
            {artist.location && (
              <p className="text-xs text-gray-500">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {artist.location}
              </p>
            )}
          </div>
          {artist.openToCollaboration && (
            <span className="ml-auto flex-shrink-0 bg-green-900/50 text-green-400 text-xs font-semibold px-2 py-1 rounded-full border border-green-700">
              Open
            </span>
          )}
        </div>

        {/* Bio */}
        {artist.bio && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{artist.bio}</p>
        )}

        {/* Skills */}
        <div className="mb-3">
          <h4 className="text-xs uppercase text-gray-500 font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {artist.skills.map(skill => (
              <span
                key={skill}
                className="inline-block bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-purple-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Genres */}
        {artist.genres && artist.genres.length > 0 && (
          <div>
            <h4 className="text-xs uppercase text-gray-500 font-semibold mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {artist.genres.map(genre => (
                <span
                  key={genre}
                  className="inline-block bg-indigo-900/40 rounded-full px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-700/50"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Social links */}
      {(artist.soundcloudUrl || artist.instagramUrl || artist.twitterUrl) && (
        <div className="px-5 pb-3 flex gap-3">
          {artist.soundcloudUrl && (
            <a
              href={artist.soundcloudUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors"
              title="SoundCloud"
            >
              <i className="fab fa-soundcloud text-lg"></i>
            </a>
          )}
          {artist.instagramUrl && (
            <a
              href={artist.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 transition-colors"
              title="Instagram"
            >
              <i className="fab fa-instagram text-lg"></i>
            </a>
          )}
          {artist.twitterUrl && (
            <a
              href={artist.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
              title="Twitter / X"
            >
              <i className="fab fa-twitter text-lg"></i>
            </a>
          )}
        </div>
      )}

      {/* Connect CTA */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        {isOwnProfile ? (
          <p className="text-center text-xs text-gray-500">This is your profile</p>
        ) : status === 'sent' ? (
          <p className="text-center text-sm text-green-400 font-semibold">
            <i className="fas fa-check-circle mr-2"></i>Request sent!
          </p>
        ) : (
          <>
            {showMessageBox ? (
              <div className="space-y-2">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Introduce yourself and describe the collab..."
                  className="w-full bg-gray-700 text-white text-sm rounded-lg p-2 border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleConnect}
                    disabled={!message.trim() || status === 'sending' || !currentUser}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    onClick={() => { setShowMessageBox(false); setMessage(''); }}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
                {status === 'error' && (
                  <p className="text-red-400 text-xs">Failed to send. Please try again.</p>
                )}
              </div>
            ) : (
              <button
                onClick={() => currentUser ? setShowMessageBox(true) : undefined}
                disabled={!currentUser}
                title={currentUser ? 'Send collaboration request' : 'Sign in to connect'}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full transition-colors text-sm flex items-center justify-center"
              >
                <i className="fas fa-handshake mr-2"></i>Connect
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArtistCard;
