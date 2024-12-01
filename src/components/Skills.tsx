import React, { useEffect, useRef, useState } from 'react';
import { CircleDot, Code, Wrench, Brain, Globe, Bot, Users, ToggleLeft, Sword, Layout, Server } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { COMPLETION_XP } from '../types/game';
import { skillTreeData, type SkillNode, skillCategories, type SkillCategory } from '../data/gameData';
import * as LucideIcons from 'lucide-react';

// Create an icon map
const iconMap = {
  CircleDot,
  Code,
  Wrench,
  Brain,
  Globe,
  Bot,
  Users
} as const;

// Create a map for category icons
const categoryIconMap = {
  'Programming': Sword,
  'Languages': Globe,
  'Tools': Wrench,
  'Concepts': Brain,
  'Soft Skills': Users,
  'Frontend Frameworks & Libraries': Layout,
  'Runtime & Server': Server,
  'AI & Machine Learning': Bot
} as const;

function updateSkillTreePositions() {
  const CORE_X = 50;
  const CORE_Y = 15;
  const VERTICAL_GAP = 35;     // Increased significantly
  const MARGIN = 15;          // Decreased to allow more spread
  const CATEGORY_WIDTH = 65;   // Decreased to bring columns closer to center
  const MAX_HEIGHT = 95;      // Increased to use more vertical space
  const DYNAMIC_GAP_MULTIPLIER = 2.0; // Increased for more vertical spacing


  // Position core node
  const coreNode = skillTreeData.find(n => n.id === 'core');
  if (coreNode) {
    coreNode.x = CORE_X;
    coreNode.y = CORE_Y;
  }

  // Group nodes by their parent/category
  const columns: { [key: string]: SkillNode[] } = {};
  
  skillTreeData.forEach(node => {
    if (node.id !== 'core') {
      const parentId = node.dependencies[0];
      if (!columns[parentId]) {
        columns[parentId] = [];
      }
      columns[parentId].push(node);
    }
  });

  // Position category nodes in a row below core
  const categoryNodes = skillTreeData.filter(node => node.dependencies[0] === 'core');
  const categorySpacing = CATEGORY_WIDTH / (categoryNodes.length - 1);
  
  categoryNodes.forEach((node, index) => {
    node.x = CORE_X - (CATEGORY_WIDTH / 2) + (index * categorySpacing);
    node.y = CORE_Y + VERTICAL_GAP;
    
    // Position child nodes in columns with dynamic spacing
    if (columns[node.id]) {
      const childCount = columns[node.id].length;
      const dynamicGap = Math.min(VERTICAL_GAP * DYNAMIC_GAP_MULTIPLIER, (MAX_HEIGHT - node.y) / (childCount + 1));
      
      columns[node.id].forEach((childNode, childIndex) => {
        childNode.x = node.x;
        childNode.y = node.y + ((childIndex + 1) * dynamicGap);
      });
    }
  });

  // Keep nodes within bounds with wider margins
  skillTreeData.forEach(node => {
    node.x = Math.max(MARGIN, Math.min(100 - MARGIN, node.x));
    node.y = Math.max(MARGIN, Math.min(MAX_HEIGHT, node.y));
  });
}

function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);
  const { addProgress, progress } = useGame();
  const [isTreeView, setIsTreeView] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections twice - once for the glow, once for the line
      skillTreeData.forEach(skill => {
        skill.dependencies.forEach(depId => {
          const parentSkill = skillTreeData.find(s => s.id === depId);
          if (parentSkill) {
            const isConnectionActive = progress.skills.has(skill.id) && progress.skills.has(parentSkill.id);
            
            if (isConnectionActive) {
              // First pass - draw glow
              ctx.beginPath();
              ctx.shadowBlur = 20;
              ctx.shadowColor = skill.color;
              ctx.strokeStyle = skill.color;
              ctx.lineWidth = 8;
              ctx.globalAlpha = 0.5;

              const startX = (parentSkill.x / 100) * canvas.width;
              const startY = (parentSkill.y / 100) * canvas.height;
              const endX = (skill.x / 100) * canvas.width;
              const endY = (skill.y / 100) * canvas.height;
              
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();

              // Second pass - draw solid line
              ctx.beginPath();
              ctx.shadowBlur = 0;
              ctx.lineWidth = 4;
              ctx.globalAlpha = 1;
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();
            } else {
              // Inactive connection
              ctx.beginPath();
              ctx.shadowBlur = 0;
              ctx.strokeStyle = skill.color + '20';
              ctx.lineWidth = 2;
              ctx.globalAlpha = 0.3;
              
              const startX = (parentSkill.x / 100) * canvas.width;
              const startY = (parentSkill.y / 100) * canvas.height;
              const endX = (skill.x / 100) * canvas.width;
              const endY = (skill.y / 100) * canvas.height;
              
              ctx.moveTo(startX, startY);
              ctx.lineTo(endX, endY);
              ctx.stroke();
            }
            ctx.globalAlpha = 1;
          }
        });
      });
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawConnections();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [progress]);

  useEffect(() => {
    if (!progress.skills.has('core')) {
      addProgress({ type: 'VIEW_SKILL', id: 'core' });
    }
  }, []);

  useEffect(() => {
    if (isTreeView) {
      updateSkillTreePositions();
    }
  }, [isTreeView]);

  const handleSkillClick = (skill: SkillNode) => {
    const canUnlock = skill.dependencies.every(depId => 
      progress.skills.has(depId) || depId === ''
    );
    if (canUnlock) {
      addProgress({ type: 'VIEW_SKILL', id: skill.id });
    }
  };

  const handleViewToggle = () => {
    setIsTreeView(prev => !prev);
    if (!isTreeView) {
      updateSkillTreePositions();
    }
  };

  const handleCategoryClick = (category: string) => {
    const categoryId = category.toLowerCase().replace(/\s+&\s+/g, '_').replace(/\s+/g, '_');
    if (!progress.skills.has(categoryId)) {
      addProgress({ type: 'VIEW_SKILL', id: categoryId });
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50" id="skills">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center gap-4">
            <CircleDot className="text-yellow-400 w-8 h-8" />
            <h2 className="text-4xl font-bold">Skill Tree</h2>
          </div>
          
          {/* View Toggle Button */}
          <button
            type="button"
            onClick={handleViewToggle}
            className="z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <ToggleLeft className={`w-4 h-4 ${isTreeView ? 'rotate-180' : ''} transition-transform`} />
            <span>{isTreeView ? 'Category View' : 'Tree View'}</span>
          </button>
        </div>

        {isTreeView ? (
          // Tree View
          <div className="relative h-[900px] overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full"
            />
            
            {skillTreeData.map((skill) => (
              <div
                key={skill.id}
                style={{
                  position: 'absolute',
                  left: `${skill.x}%`,
                  top: `${skill.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`
                  relative group cursor-pointer
                  ${progress.skills.has(skill.id) ? 'opacity-100' : 'opacity-60'}
                `}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                onClick={() => handleSkillClick(skill)}
              >
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${progress.skills.has(skill.id) 
                      ? `bg-opacity-20 bg-${skill.color} ring-2 ring-${skill.color} animate-pulse-slow` 
                      : 'bg-gray-800 ring-1 ring-gray-600'}
                  `}
                >
                  {skill.icon && (() => {
                    const Icon = iconMap[skill.icon as keyof typeof iconMap];
                    return <Icon className={`w-6 h-6 ${progress.skills.has(skill.id) ? 'text-' + skill.color : 'text-gray-400'}`} />;
                  })()}
                </div>

                {/* Tooltip */}
                {hoveredSkill?.id === skill.id && (
                  <div className={`
                    fixed z-[100] w-48 p-2 bg-black rounded-lg shadow-xl -translate-x-1/2 left-[${skill.x}%]
                    ${skill.dependencies.length === 0 ? 'top-[calc(${skill.y}%-120px)]' : 'top-[calc(${skill.y}%-100px)]'}
                    pointer-events-none
                    border border-gray-700
                  `}>
                    <h4 className="font-bold text-white">{skill.name}</h4>
                    {skill.description && (
                      <p className="text-sm text-gray-100">{skill.description}</p>
                    )}
                    <div className="flex mt-1 space-x-1">
                      {[...Array(skill.level === 'advanced' ? 3 : skill.level === 'intermediate' ? 2 : 1)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full bg-${skill.color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Category View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skillCategories).map(([category, data]: [string, SkillCategory]) => (
              <div 
                key={category} 
                className={`
                  relative p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors group cursor-pointer select-none
                  ${progress.skills.has(category.toLowerCase().replace(/\s+&\s+/g, '_').replace(/\s+/g, '_')) 
                    ? 'ring-2 ring-blue-500/50' 
                    : ''
                  }
                `}
                onClick={() => handleCategoryClick(category)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(category)}
              >
                {/* XP Indicator - only show if not clicked */}
                {!progress.skills.has(category.toLowerCase().replace(/\s+&\s+/g, '_').replace(/\s+/g, '_')) && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    +{COMPLETION_XP.SKILL} XP
                  </div>
                )}

                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {(() => {
                    const Icon = categoryIconMap[category as keyof typeof categoryIconMap];
                    return <Icon className={`w-6 h-6 ${data.iconColor}`} />;
                  })()}
                  {category}
                </h3>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{skill.name}</span>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all"
                          style={{ 
                            width: `${skill.level === 'advanced' ? '100' : skill.level === 'intermediate' ? '66' : '33'}%`,
                            backgroundColor: data.iconColor.includes('blue') ? '#3b82f6' :
                                            data.iconColor.includes('green') ? '#22c55e' :
                                            data.iconColor.includes('purple') ? '#a855f7' :
                                            data.iconColor.includes('yellow') ? '#eab308' :
                                            data.iconColor.includes('red') ? '#ef4444' :
                                            data.iconColor.includes('pink') ? '#ec4899' :
                                            data.iconColor.includes('orange') ? '#f97316' :
                                            data.iconColor.includes('indigo') ? '#818cf8' : '#3b82f6'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;