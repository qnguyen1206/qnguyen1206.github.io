import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useGame } from '../context/GameContext';
import { skillCategories } from '../data/gameData';
import { COMPLETION_XP } from '../types/game';

function SkillBar({ level }: { level: string }) {
  const width = level === 'advanced' ? 'w-full' : level === 'intermediate' ? 'w-2/3' : 'w-1/3';
  const color = level === 'advanced' ? 'bg-green-500' : level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div className="h-2 bg-gray-700 rounded-full w-24">
      <div className={`h-full rounded-full ${width} ${color}`} />
    </div>
  );
}

function Skills() {
  const { addProgress, progress } = useGame();

  const renderIcon = (iconName: string, colorClass: string) => {
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return Icon ? <Icon className={`w-6 h-6 ${colorClass}`} /> : null;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" id="skills">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <LucideIcons.Star className="text-yellow-400 w-8 h-8" />
          <h2 className="text-4xl font-bold text-center">Skill Tree</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {Object.entries(skillCategories).map(([category, { iconName, iconColor, skills }]) => (
            <div 
              key={category}
              onClick={() => addProgress({ type: 'VIEW_SKILL', id: category })}
              className={`relative bg-gray-800/100 rounded-lg p-6 hover:bg-gray-800/90 transition-all duration-300 cursor-pointer ${
                progress.skills.has(category) ? 'border-yellow-500 border' : 'border-gray-700 border'
              }`}
            >
              {!progress.skills.has(category) && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  +{COMPLETION_XP.SKILL} XP
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                {renderIcon(iconName, iconColor)}
                <h3 className="text-xl font-semibold text-blue-400">{category}</h3>
              </div>
              <ul className="space-y-4">
                {skills.map((skill, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{skill.name}</span>
                    <SkillBar level={skill.level} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;