import React, { createContext, useContext, useState } from 'react';
import { ProgressAction, GameProgress, COMPLETION_XP } from '../types/game';
import { TOTAL_PROJECTS, TOTAL_SKILLS, TOTAL_EXPERIENCES, TOTAL_EDUCATION, TOTAL_GALLERY } from '../data/gameData';
import { skillTreeData } from '../data/gameData';

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
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const { level } = JSON.parse(saved);
      return level;
    }
    return 1;
  });

  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const { xp } = JSON.parse(saved);
      return xp;
    }
    return 0;
  });

  const [progress, setProgress] = useState<GameProgress>(() => {
    const saved = localStorage.getItem('gameState');
    if (saved) {
      const { progress: savedProgress } = JSON.parse(saved);
      return {
        projects: new Set(savedProgress.projects),
        skills: new Set(savedProgress.skills),
        experiences: new Set(savedProgress.experiences),
        education: new Set(savedProgress.education),
        gallery: new Set(savedProgress.gallery),
        totalProjects: TOTAL_PROJECTS,
        totalSkills: TOTAL_SKILLS,
        totalExperiences: TOTAL_EXPERIENCES,
        totalEducation: TOTAL_EDUCATION,
        totalGallery: TOTAL_GALLERY
      };
    }
    return {
      projects: new Set<string>(),
      skills: new Set<string>(),
      experiences: new Set<string>(),
      education: new Set<string>(),
      gallery: new Set<string>(),
      totalProjects: TOTAL_PROJECTS,
      totalSkills: TOTAL_SKILLS,
      totalExperiences: TOTAL_EXPERIENCES,
      totalEducation: TOTAL_EDUCATION,
      totalGallery: TOTAL_GALLERY
    };
  });

  const addProgress = ({ type, id }: ProgressAction) => {
    try {
      if (!id) throw new Error('Invalid progress ID');
      
      // Helper function to add XP without affecting progress
      const addXPOnly = (amount: number) => {
        setXP((prev: number) => {
          const newXP = prev + amount;
          setLevel(Math.floor(newXP / 100) + 1);
          return newXP;
        });
      };

      if (type === 'VIEW_PROJECT' && !progress.projects.has(id)) {
        setProgress(prev => {
          const newProjects = new Set(prev.projects).add(id);
          addXPOnly(COMPLETION_XP.PROJECT);
          return { ...prev, projects: newProjects };
        });
      } else if (type === 'VIEW_SKILL' && !progress.skills.has(id)) {
        // Check if this node exists in the tree data
        const treeNode = skillTreeData.find(node => node.id === id);
        
        if (treeNode) {
          // Tree view node - only add XP
          addXPOnly(COMPLETION_XP.SKILL);
          // Mark as seen to prevent duplicate XP
          setProgress(prev => ({
            ...prev,
            skills: new Set(prev.skills).add(id)
          }));
        } else {
          // Category view node - update both progress and XP
          setProgress(prev => {
            const newSkills = new Set(prev.skills).add(id);
            addXPOnly(COMPLETION_XP.SKILL);
            return { ...prev, skills: newSkills };
          });
        }
      } else if (type === 'VIEW_EXPERIENCE' && !progress.experiences.has(id)) {
        setProgress(prev => {
          const newExperiences = new Set(prev.experiences).add(id);
          addXPOnly(COMPLETION_XP.EXPERIENCE);
          return { ...prev, experiences: newExperiences };
        });
      } else if (type === 'VIEW_EDUCATION' && !progress.education.has(id)) {
        setProgress(prev => {
          const newEducation = new Set(prev.education).add(id);
          addXPOnly(COMPLETION_XP.EDUCATION);
          return { ...prev, education: newEducation };
        });
      } else if (type === 'VIEW_GALLERY' && !progress.gallery.has(id)) {
        setProgress(prev => {
          const newGallery = new Set(prev.gallery).add(id);
          addXPOnly(COMPLETION_XP.GALLERY);
          return { ...prev, gallery: newGallery };
        });
      }
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const addXP = (amount: number) => {
    setXP((prev: number) => {
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