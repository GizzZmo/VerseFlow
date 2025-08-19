import React, { useState } from 'react';
import Header from './components/Header';
import BeatExchange from './components/BeatExchange';
import CollaborationHub from './components/CollaborationHub';
import AudioPlayer from './components/AudioPlayer';
import { Beat, CurrentUser } from './types';
import { signInWithSoundCloud } from './services/authService';

type View = 'beatExchange' | 'cypher';

const App: React.FC = () => {
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeView, setActiveView] = useState<View>('beatExchange');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const handleSelectBeat = (beat: Beat) => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  };
  
  const handlePlayPause = () => {
    if (currentBeat) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await signInWithSoundCloud();
      setCurrentUser(user);
    } catch (error) {
      console.error("Login simulation failed:", error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'beatExchange':
        return (
          <BeatExchange
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onSelectBeat={handleSelectBeat}
          />
        );
      case 'cypher':
        return <CollaborationHub currentUser={currentUser} />;
      default:
        return (
          <BeatExchange
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onSelectBeat={handleSelectBeat}
          />
        );
    }
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header 
        activeView={activeView} 
        onNavigate={setActiveView}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8 pb-28 animate-fadeIn"> {/* Add padding-bottom for player */}
        {renderActiveView()}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} VerseFlow. All rights reserved.</p>
      </footer>
       <AudioPlayer 
        currentBeat={currentBeat}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
    </div>
  );
};

export default App;