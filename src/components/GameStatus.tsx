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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <ErrorBoundary fallback={<div>Error loading game status</div>}>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800/90 p-3 rounded-lg border border-blue-500 z-50 transition-all duration-300">
        {showXP && <XPTooltip amount={xpAmount} />}
        
        {/* Always visible section */}
        <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <Shield className="text-blue-400 w-5 h-5" />
            <span className="text-sm font-bold">Level {level}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs">XP</span>
            <div className="w-24 bg-gray-700 rounded-full h-1.5">
              <div className="bg-blue-500 h-full rounded-full transition-all"
                   style={{ width: `${xpProgress * 100}%` }} />
            </div>
            <span className="text-xs">{Math.floor(xpProgress * 100)}%</span>
          </div>
        </div>

        {/* Expandable section */}
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 mt-4' : 'max-h-0'}`}>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs">Projects</span>
              <div className="w-24 bg-gray-700 rounded-full h-1.5">
                <div className="bg-green-500 h-full rounded-full transition-all"
                     style={{ width: `${projectProgress}%` }} />
              </div>
              <span className="text-xs">{progress.projects.size}/{progress.totalProjects}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs">Skills</span>
              <div className="w-24 bg-gray-700 rounded-full h-1.5">
                <div className="bg-yellow-500 h-full rounded-full transition-all"
                     style={{ width: `${skillProgress}%` }} />
              </div>
              <span className="text-xs">{progress.skills.size}/{progress.totalSkills}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs">Exp</span>
              <div className="w-24 bg-gray-700 rounded-full h-1.5">
                <div className="bg-purple-500 h-full rounded-full transition-all"
                     style={{ width: `${experienceProgress}%` }} />
              </div>
              <span className="text-xs">{progress.experiences.size}/{progress.totalExperiences}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs">Edu</span>
              <div className="w-24 bg-gray-700 rounded-full h-1.5">
                <div className="bg-green-500 h-full rounded-full transition-all"
                     style={{ width: `${educationProgress}%` }} />
              </div>
              <span className="text-xs">{progress.education.size}/{progress.totalEducation}</span>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 