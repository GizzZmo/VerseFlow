import Header from './components/Header';
import BeatExchange from './components/BeatExchange';
import CollaborationHub from './components/CollaborationHub';
import FavoritesView from './components/FavoritesView';
import AudioPlayer from './components/AudioPlayer';
import { Beat, CurrentUser } from './types';
import { signInWithSoundCloud } from './services/authService';
import { useUser } from './contexts/UserContext';

type View = 'beatExchange' | 'cypher' | 'favorites';

const AppContent: React.FC = () => {
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeView, setActiveView] = useState<View>('beatExchange');
  const [beats, setBeats] = useState<Beat[]>([]);
  
  const { currentUser, setCurrentUser, addNotification } = useUser();

  const handleSelectBeat = useCallback((beat: Beat) => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBeat(beat);
      setIsPlaying(true);
    }
  }, [currentBeat?.id, isPlaying]);
  
  const handlePlayPause = useCallback(() => {
    if (currentBeat) {
      setIsPlaying(!isPlaying);
    }
  }, [currentBeat, isPlaying]);

  const handleLogin = useCallback(async () => {
    try {
      const user = await signInWithSoundCloud();
      setCurrentUser(user);
      addNotification({
        type: 'system',
        title: 'Welcome back!',
        message: `Welcome back to VerseFlow, ${user.name}! Start exploring beats and collaborations.`,
        read: false
      });
    } catch (error) {
      console.error("Login simulation failed:", error);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'beatExchange':
        return (
          <BeatExchange
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onSelectBeat={handleSelectBeat}
            onBeatsLoad={setBeats}
          />
        );
      case 'cypher':
        return <CollaborationHub currentUser={currentUser} />;
      case 'favorites':
        return (
          <FavoritesView
            beats={beats}
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onSelectBeat={handleSelectBeat}
          />
        );
      default:
        return (
          <BeatExchange
            currentBeat={currentBeat}
            isPlaying={isPlaying}
            onSelectBeat={handleSelectBeat}
            onBeatsLoad={setBeats}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header 
        activeView={activeView} 
        onNavigate={setActiveView}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8 pb-28 animate-fadeIn">
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

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;