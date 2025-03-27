import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { projects, galleryItems } from '../data/gameData';
import { COMPLETION_XP, type Project } from '../types/game';
import { GallerySkeleton } from './GallerySkeleton';
import imageCompression from 'browser-image-compression';
import { LazyImage } from './LazyImage';

const STATUS_COLORS = {
  'In Development': 'bg-yellow-500/20 text-yellow-300',
  'On Hold': 'bg-red-500/20 text-red-300',
  'Finished': 'bg-green-500/20 text-green-300',
  'Private': 'bg-gray-500/20 text-cyan-300',
  'Under NDA': 'bg-purple-500/20 text-purple-300',
  'API Deprecated': 'bg-orange-500/20 text-orange-300'
} as const;

const compressionOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1024,
  useWebWorker: true
};

function Projects() {
  const [selectedType, setSelectedType] = useState('all');
  const [activeSection, setActiveSection] = useState<'projects' | 'gallery'>('projects');
  const [isLoading, setIsLoading] = useState(true);
  const { addProgress, progress } = useGame();

  useEffect(() => {
    setSelectedType('all');
  }, [activeSection]);

  useEffect(() => {
    // Reset loading state when section or filter changes
    setIsLoading(true);
  }, [activeSection, selectedType]);

  // Function to preload images
  const preloadImages = async (items: typeof galleryItems) => {
    const loadImage = async (src: string) => {
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });
        const compressedBlob = await imageCompression(file, compressionOptions);
        const url = URL.createObjectURL(compressedBlob);
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    try {
      await Promise.all(items.map(item => loadImage(item.image)));
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'gallery') {
      const filteredItems = selectedType === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.categories.includes(selectedType as any));
      preloadImages(filteredItems);
    }
  }, [activeSection, selectedType]);

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

        {/* Section Toggle */}
        <div className="flex justify-center mb-8 relative z-50">
          <div className="relative bg-gray-800 p-1 rounded">
            <div
              className="absolute inset-y-1 transition-all duration-300 rounded bg-green-500"
              style={{
                width: '50%',
                left: activeSection === 'projects' ? '0%' : '50%',
              }}
            />
            <div className="relative flex">
              <button
                onClick={() => setActiveSection('projects')}
                className={`px-8 py-2 text-lg transition-colors duration-300 ${
                  activeSection === 'projects'
                    ? 'text-white'
                    : 'text-red-400 hover:text-red-300'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveSection('gallery')}
                className={`px-8 py-2 text-lg transition-colors duration-300 ${
                  activeSection === 'gallery'
                    ? 'text-white'
                    : 'text-red-400 hover:text-red-300'
                }`}
              >
                Gallery
              </button>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <>
            <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10">
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
            <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10">
              {['Cybersecurity Research', 'Course Work', 'Club Projects', 'Personal Projects'].map(type => (
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
                      {project.status && (Array.isArray(project.status) ? (
                        <div className="flex flex-wrap gap-2">
                          {project.status.map((status, i) => (
                            <div
                              key={i}
                              className={`inline-block px-3 py-1 rounded-full text-sm ${
                                STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            STATUS_COLORS[project.status as keyof typeof STATUS_COLORS] || 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {project.status}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-4">
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={20} />
                          <span>Code</span>
                        </a>
                      )}
                      {project.live && (
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={20} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Gallery Section */}
        {activeSection === 'gallery' && (
          <>
            <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-10">
              {['all', 'digital', 'traditional', 'design', 'photography'].map(type => (
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
            
            {isLoading ? (
              <GallerySkeleton />
            ) : (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {galleryItems
                  .filter(item => selectedType === 'all' || item.categories.includes(selectedType as any))
                  .map((item, index) => (
                    <div
                      key={index}
                      className="break-inside-avoid mb-4"
                    >
                      <div 
                        onClick={() => addProgress({ type: 'VIEW_GALLERY', id: item.title })}
                        className={`relative overflow-hidden rounded-lg cursor-pointer
                          hover:opacity-90 transition-all duration-300 ${
                          progress.gallery?.has(item.title) ? 'ring-2 ring-purple-500' : ''
                        }`}
                      >
                        {!progress.gallery?.has(item.title) && (
                          <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            +{COMPLETION_XP.GALLERY} XP
                          </div>
                        )}
                        <LazyImage
                          src={item.image}
                          alt={item.title}
                          className="w-full object-cover"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent 
                          opacity-0 hover:opacity-100 transition-opacity duration-300"
                        >
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-200 text-sm">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Projects;