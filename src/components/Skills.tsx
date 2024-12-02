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
  const VERTICAL_GAP = 12;      // Vertical gap between nodes
  const START_Y = 10;           // Starting y position
  const MARGIN = 10;            // Edge margin
  const MAX_HEIGHT = 85;        // Maximum height
  
  // Group nodes by their parent/category
  const columns: { [key: string]: SkillNode[] } = {};
  
  // Position core node
  const coreNode = skillTreeData.find(n => n.id === 'core');
  if (coreNode) {
    coreNode.x = 50;  // Center horizontally
    coreNode.y = START_Y;
  }

  // Group nodes by their parent
  skillTreeData.forEach(node => {
    if (node.id !== 'core') {
      const parentId = node.dependencies[0];
      if (!columns[parentId]) {
        columns[parentId] = [];
      }
      columns[parentId].push(node);
    }
  });

  // Get category nodes and calculate spacing
  const categoryNodes = skillTreeData.filter(node => node.dependencies[0] === 'core');
  const numCategories = categoryNodes.length;
  const availableWidth = 100 - (2 * MARGIN);
  const categoryWidth = availableWidth / numCategories;
  
  // Position category nodes and their children
  categoryNodes.forEach((node, index) => {
    // Center each category within its allocated space
    const categoryCenter = MARGIN + (categoryWidth * index) + (categoryWidth / 2);
    node.x = categoryCenter;
    node.y = START_Y + VERTICAL_GAP;
    
    // Position child nodes in vertical columns
    if (columns[node.id]) {
      const childNodes = columns[node.id];
      const totalChildHeight = (childNodes.length - 1) * VERTICAL_GAP;
      const startY = node.y + VERTICAL_GAP;
      
      childNodes.forEach((childNode, childIndex) => {
        childNode.x = categoryCenter;  // Align with parent
        childNode.y = startY + (childIndex * VERTICAL_GAP);
        
        // Position any sub-children
        if (columns[childNode.id]) {
          const subChildren = columns[childNode.id];
          subChildren.forEach((subChild, subIndex) => {
            const subStartY = childNode.y + VERTICAL_GAP/2;
            subChild.x = categoryCenter;
            subChild.y = subStartY + (subIndex * VERTICAL_GAP);
          });
        }
      });
    }
  });

  // Find maximum y value
  let maxY = 0;
  skillTreeData.forEach(node => {
    maxY = Math.max(maxY, node.y);
  });

  // Scale y positions if they exceed MAX_HEIGHT
  if (maxY > MAX_HEIGHT) {
    const scale = (MAX_HEIGHT - START_Y) / (maxY - START_Y);
    skillTreeData.forEach(node => {
      if (node.id !== 'core') {
        node.y = START_Y + (node.y - START_Y) * scale;
      }
    });
  }

  // Keep nodes within bounds
  skillTreeData.forEach(node => {
    node.x = Math.max(MARGIN, Math.min(100 - MARGIN, node.x));
    node.y = Math.max(MARGIN, Math.min(MAX_HEIGHT, node.y));
  });
}

// Helper function to find the root parent of a node
function findRootParent(node: SkillNode, nodes: SkillNode[]): string {
  const parent = nodes.find(n => n.id === node.dependencies[0]);
  if (!parent || parent.dependencies.length === 0) {
    return parent ? parent.id : node.id;
  }
  return findRootParent(parent, nodes);
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
                    fixed z-[100] w-48 p-2 bg-black rounded-lg shadow-xl
                    transform -translate-x-1/2 -translate-y-full
                    pointer-events-none border border-gray-700
                    mb-2 top-[${skill.y}%] left-[${skill.x}%]
                  `}
                  style={{
                    top: `calc(${skill.y}% - 20px)`,
                    left: `${skill.x}%`,
                    transform: 'translate(-50%, -100%)'
                  }}>
                    <h4 className="font-bold text-white">{skill.name}</h4>
                    {skill.description && (
                      <p className="text-sm text-gray-100 mb-2">{skill.description}</p>
                    )}
                    {/* Only show progress bar for skills that are not root or first level */}
                    {skill.id !== 'core' && !['programming', 'languages', 'tools', 'concepts', 'soft_skills', 'frontend', 'runtime', 'ai_ml'].includes(skill.id) && (
                      <div className="flex flex-col gap-1">
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all"
                            style={{ 
                              width: `${skill.level === 'advanced' ? '100' : skill.level === 'intermediate' ? '66' : '33'}%`,
                              backgroundColor: skill.color
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 capitalize text-right">
                          {skill.level}
                        </span>
                      </div>
                    )}
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