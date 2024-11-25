import { useGame } from '../context/GameContext';
import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { XPTooltip } from './XPTooltip';
import { COMPLETION_XP } from '../types/game';

export default function GameStatus() {
  const { level, xp, progress } = useGame();
  const xpProgress = (xp % 100) / 100;
  
  const projectProgress = (progress.projects.size / progress.totalProjects) * 100;
  const skillProgress = (progress.skills.size / progress.totalSkills) * 100;
  const experienceProgress = (progress.experiences.size / progress.totalExperiences) * 100;
  const educationProgress = (progress.education.size / progress.totalEducation) * 100;
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXPAmount] = useState(0);

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
        </div>
      </div>
    </ErrorBoundary>
  );
} 