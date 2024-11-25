import { useGame } from '../context/GameContext';
import { Shield, Save, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { XPTooltip } from './XPTooltip';
import { COMPLETION_XP } from '../types/game';

interface SaveState {
  level: number;
  xp: number;
  progress: {
    projects: string[];
    skills: string[];
    experiences: string[];
    education: string[];
  };
}

export default function GameStatus() {
  const { level, xp, progress } = useGame();
  const xpProgress = (xp % 100) / 100;
  
  const projectProgress = (progress.projects.size / progress.totalProjects) * 100;
  const skillProgress = (progress.skills.size / progress.totalSkills) * 100;
  const experienceProgress = (progress.experiences.size / progress.totalExperiences) * 100;
  const educationProgress = (progress.education.size / progress.totalEducation) * 100;
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXPAmount] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (progress.projects.size > 0 || progress.skills.size > 0 || progress.education.size > 0) {
      const amount = (progress.projects.size * COMPLETION_XP.PROJECT) + 
                    (progress.skills.size * COMPLETION_XP.SKILL) +
                    (progress.education.size * COMPLETION_XP.EDUCATION);
      setXPAmount(amount);
      setShowXP(true);
      const timer = setTimeout(() => setShowXP(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [progress.projects.size, progress.skills.size, progress.education.size]);

  const handleSave = () => {
    const saveState: SaveState = {
      level,
      xp,
      progress: {
        projects: Array.from(progress.projects),
        skills: Array.from(progress.skills),
        experiences: Array.from(progress.experiences),
        education: Array.from(progress.education)
      }
    };
    localStorage.setItem('gameState', JSON.stringify(saveState));
    setSaveStatus({ type: 'success', message: 'Game progress saved successfully!' });
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem('gameState');
      setSaveStatus({ type: 'success', message: 'Game progress reset successfully!' });
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to reset game progress' });
    }
  };

  return (
    <ErrorBoundary fallback={<div>Error loading game status</div>}>
      <div className="relative backdrop-blur-md bg-black/30 p-4 rounded-lg border border-blue-500/20 shadow-lg">
        {showXP && <XPTooltip amount={xpAmount} />}
        
        <div className="flex flex-col gap-6">
          {/* Level and XP */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="text-blue-400 w-8 h-8" />
              <span className="text-2xl font-bold">Level {level}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">XP</span>
              <div className="w-48 bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-500 h-full rounded-full transition-all"
                     style={{ width: `${xpProgress * 100}%` }} />
              </div>
              <span className="text-sm">{Math.floor(xpProgress * 100)}%</span>
            </div>
          </div>

          {/* Progress Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Projects</span>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-full rounded-full transition-all"
                     style={{ width: `${projectProgress}%` }} />
              </div>
              <span className="text-xs text-center">{progress.projects.size}/{progress.totalProjects}</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Skills</span>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-full rounded-full transition-all"
                     style={{ width: `${skillProgress}%` }} />
              </div>
              <span className="text-xs text-center">{progress.skills.size}/{progress.totalSkills}</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Experience</span>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-full rounded-full transition-all"
                     style={{ width: `${experienceProgress}%` }} />
              </div>
              <span className="text-xs text-center">{progress.experiences.size}/{progress.totalExperiences}</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Education</span>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-full rounded-full transition-all"
                     style={{ width: `${educationProgress}%` }} />
              </div>
              <span className="text-xs text-center">{progress.education.size}/{progress.totalEducation}</span>
            </div>
          </div>
          
          {/* Save and Reset Buttons */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Reset Progress
              </button>
            </div>
            {saveStatus && (
              <p className={`text-sm ${saveStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {saveStatus.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add save modal */}
      {showSaveModal && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mt-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Game Saved!
        </div>
      )}
    </ErrorBoundary>
  );
} 