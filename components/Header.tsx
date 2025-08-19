import React from 'react';
import { CurrentUser } from '../types';

type View = 'beatExchange' | 'cypher';

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
  currentUser: CurrentUser | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onNavigate, currentUser, onLogin, onLogout }) => {
  const linkClasses = (view: View) => 
    `cursor-pointer hover:text-purple-400 transition-colors pb-1 ${
      activeView === view ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-300'
    }`;

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <i className="fas fa-headphones-alt text-3xl text-purple-400"></i>
           <h1 className="text-2xl font-bold tracking-tight text-white">Verse<span className="text-purple-400">Flow</span></h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a onClick={() => onNavigate('beatExchange')} className={linkClasses('beatExchange')}>Beat Exchange</a>
          <a onClick={() => onNavigate('cypher')} className={linkClasses('cypher')}>The Cypher</a>
          <a href="#" className="text-gray-500 cursor-not-allowed">Distribution</a>
          <a href="#" className="text-gray-500 cursor-not-allowed">Academy</a>
        </nav>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <div className="flex items-center space-x-2">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full border-2 border-purple-400" />
                <span className="text-sm font-medium hidden sm:block">{currentUser.name}</span>
              </div>
              <button onClick={onLogout} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm">
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={onLogin} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-full transition-colors text-sm flex items-center">
               <i className="fab fa-soundcloud mr-2"></i>
               Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
