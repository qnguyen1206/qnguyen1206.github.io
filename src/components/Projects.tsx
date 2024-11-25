import React, { useState } from 'react';
import { ExternalLink, Github, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { projects, TOTAL_PROJECTS } from '../data/gameData';
import { COMPLETION_XP, type Project } from '../types/game';

const STATUS_COLORS = {
  'In Development': 'bg-blue-500/20 text-blue-300',
  'Private': 'bg-purple-500/20 text-purple-300',
  'Under NDA': 'bg-red-500/20 text-red-300',
  'API Deprecated': 'bg-yellow-500/20 text-yellow-300'
} as const;

function Projects() {
  const [selectedType, setSelectedType] = useState('all');
  const { addProgress, progress } = useGame();

  const filteredProjects = selectedType === 'all' 
    ? projects 
    : projects.filter(project => project.types.includes(selectedType));

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50" id="projects">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <Trophy className="text-yellow-400 w-8 h-8" />
          <h2 className="text-4xl font-bold text-center">Quest Log</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['all', 'Game Development', 'Web Development', 'App Development'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['Security Research', 'Course Work', 'Club Projects', 'Personal Projects'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <div 
              key={index}
              onClick={() => addProgress({ type: 'VIEW_PROJECT', id: project.title })}
              className={`relative bg-gray-800/100 rounded-lg overflow-hidden hover:bg-gray-800/90 transition-all duration-300 cursor-pointer ${
                progress.projects.has(project.title) ? 'border-green-500 border' : 'border-gray-700 border'
              }`}
            >
              {!progress.projects.has(project.title) && (
                <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  +{COMPLETION_XP.PROJECT} XP
                </div>
              )}
              <div className="h-48 overflow-hidden relative group">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
                  {project.types.map((type, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/80 text-sm rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-left">{project.description}</p>
                <div className="space-y-4">
                  <div className="flex items-left gap-2 text-sm text-gray-400 text-left">
                    <span className="font-semibold">Tech:</span> {project.tech}
                  </div>
                  {project.status && (
                    <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                      STATUS_COLORS[project.status as keyof typeof STATUS_COLORS] || 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {project.status}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                      <Github size={20} />
                      <span>Code</span>
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={20} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;