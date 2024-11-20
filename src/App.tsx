import React, { useState } from 'react';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import { Suspense, lazy } from 'react';
import GameStatus from './components/GameStatus';
import { GameProvider, useGame } from './context/GameContext';
import { COMPLETION_XP } from './types/game';

const Projects = lazy(() => import('./components/Projects'));
const Skills = lazy(() => import('./components/Skills'));
const Contact = lazy(() => import('./components/Contact'));
const Experience = lazy(() => import('./components/Experience'));
const Education = lazy(() => import('./components/Education'));

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

function AppContent() {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const { addXP } = useGame();

  const handleArrowClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 1) {
        setShowEasterEgg(true);
        addXP(COMPLETION_XP.EASTER_EGG);
        setClickCount(0);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto w-full">
          <div className="space-y-6 animate-fadeIn">
            <h1 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 break-words whitespace-normal pb-3">
              Quang Nguyen
            </h1>
            <div className="space-y-6">
              <p className="text-2xl sm:text-3xl text-gray-300">
                Game Developer & Full Stack Software Developer
              </p>
              <p className="text-lg sm:text-xl text-gray-400 max-w-6xl">
                Software Developer specializing in Game Development, Web Applications, and AI.
                <br />
                Currently on a quest at Georgia Institute of Technology to achieve a Bachelor's degree in Computational Media.
              </p>

              <blockquote className="text-lg italic text-gray-400 border-l-4 border-blue-400 pl-4">
                "Some people call this artificial intelligence, but the reality is this technology will enhance us.
                <br />
                So instead of artificial intelligence, I think we’ll augment our intelligence."
                <br />
                - <i>Ginni Rometty</i> -
              </blockquote>

              <blockquote className="text-lg italic text-gray-400 border-l-4 border-blue-400 pl-4">
                "HINT: There is an easter egg in this website. Send me an email if you find it!"
              </blockquote>

              <p className="text-sm sm:text-base text-gray-400 max-w-6xl">
                Fun Fact: This portfolio was crafted with the assistance of AI tools: Cursor, V0, and Bolt.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="https://github.com/Kairu1206" target="_blank" rel="noopener noreferrer" 
                 className="p-2 hover:text-blue-400 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://gitlab.com/Kairu1206" target="_blank" rel="noopener noreferrer"
                 className="p-2 hover:text-blue-400 transition-colors">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none">
                  <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/quang-nguyen-584005251" target="_blank" rel="noopener noreferrer"
                 className="p-2 hover:text-blue-400 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:contact@example.com"
                 className="p-2 hover:text-blue-400 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
        <div 
          onClick={handleArrowClick}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        >
          <ChevronDown size={32} />
        </div>
      </section>

      {showEasterEgg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md text-center">
            <h3 className="text-2xl font-bold mb-4">🎮 Easter Egg Found!</h3>
            <p className="text-gray-300 mb-4">You've discovered a secret! +50 XP</p>
            <button
              onClick={() => setShowEasterEgg(false)}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue Quest
            </button>
          </div>
        </div>
      )}

      {/* Game Sections */}
      <div className="space-y-20">
        <Suspense fallback={<div>Loading...</div>}>
          <Projects />
          <Experience />
          <Education />
          <Skills />
          <Contact />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400">
        <p>© 2024 Quang Nguyen. All rights reserved.</p>
      </footer>

      <GameStatus />
    </div>
  );
}

export default App;