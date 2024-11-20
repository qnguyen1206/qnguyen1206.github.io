import React, { createContext, useContext, useState } from 'react';
import { ProgressAction, GameProgress, COMPLETION_XP } from '../types/game';
import { TOTAL_PROJECTS, TOTAL_SKILLS, TOTAL_EXPERIENCES, TOTAL_EDUCATION } from '../data/gameData';

interface GameState {
  level: number;
  xp: number;
  progress: GameProgress;
  addProgress: (action: ProgressAction) => void;
  addXP: (amount: number) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);
  const [progress, setProgress] = useState<GameProgress>(() => ({
    projects: new Set<string>(),
    skills: new Set<string>(),
    experiences: new Set<string>(),
    education: new Set<string>(),
    totalProjects: TOTAL_PROJECTS,
    totalSkills: TOTAL_SKILLS,
    totalExperiences: TOTAL_EXPERIENCES,
    totalEducation: TOTAL_EDUCATION
  }));

  const addProgress = ({ type, id }: ProgressAction) => {
    try {
      if (!id) throw new Error('Invalid progress ID');
      
      if (type === 'VIEW_PROJECT' && !progress.projects.has(id)) {
        setProgress(prev => {
          const newProjects = new Set(prev.projects).add(id);
          setXP(prev => {
            const newXP = prev + COMPLETION_XP.PROJECT;
            setLevel(Math.floor(newXP / 100) + 1);
            return newXP;
          });
          return { ...prev, projects: newProjects };
        });
      } else if (type === 'VIEW_SKILL' && !progress.skills.has(id)) {
        setProgress(prev => {
          const newSkills = new Set(prev.skills).add(id);
          setXP(prev => {
            const newXP = prev + COMPLETION_XP.SKILL;
            setLevel(Math.floor(newXP / 100) + 1);
            return newXP;
          });
          return { ...prev, skills: newSkills };
        });
      } else if (type === 'VIEW_EXPERIENCE' && !progress.experiences.has(id)) {
        setProgress(prev => {
          const newExperiences = new Set(prev.experiences).add(id);
          setXP(prev => {
            const newXP = prev + COMPLETION_XP.EXPERIENCE;
            setLevel(Math.floor(newXP / 100) + 1);
            return newXP;
          });
          return { ...prev, experiences: newExperiences };
        });
      } else if (type === 'VIEW_EDUCATION' && !progress.education.has(id)) {
        setProgress(prev => {
          const newEducation = new Set(prev.education).add(id);
          setXP(prev => {
            const newXP = prev + COMPLETION_XP.EDUCATION;
            setLevel(Math.floor(newXP / 100) + 1);
            return newXP;
          });
          return { ...prev, education: newEducation };
        });
      }
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const addXP = (amount: number) => {
    setXP(prev => {
      const newXP = prev + amount;
      setLevel(Math.floor(newXP / 100) + 1);
      return newXP;
    });
  };

  return (
    <GameContext.Provider value={{ level, xp, progress, addProgress, addXP }}>
      {children}
    </GameContext.Provider>
  );
} 