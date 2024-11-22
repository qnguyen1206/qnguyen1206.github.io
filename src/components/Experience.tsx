import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { COMPLETION_XP } from '../types/game';

const experiences = [
  {
    title: 'Customer Service',
    company: 'Pho Nam ATL',
    period: 'June 2023 - Present',
    type: 'Work'
  },
  {
    title: 'Summer Camp Counselor',
    company: 'Lake Wenatchee YMCA',
    period: 'June 2024 - August 2024',
    type: 'Work'
  },
  {
    title: 'Project Lead & Game Development Programmer',
    company: 'Game Development Projects',
    period: 'June 2022 - Present',
    type: 'Other',
    description: 'Leading game development projects and programming implementation.'
  },
  {
    title: 'App Development Lead',
    company: 'Mobile Development Projects',
    period: 'June 2023 - Aug 2023',
    type: 'Other',
    description: 'Leading mobile app development and design.'
  }
];

function Experience() {
  const { addProgress, progress } = useGame();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50" id="experience">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <Briefcase className="text-blue-400 w-8 h-8" />
          <h2 className="text-4xl font-bold text-center">Quest History</h2>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              onClick={() => addProgress({ type: 'VIEW_EXPERIENCE', id: exp.title })}
              className={`relative bg-gray-800/100 rounded-lg p-8 hover:bg-gray-800/90 transition-all duration-300 cursor-pointer border min-h-[160px] ${
                progress.experiences?.has(exp.title) ? 'border-blue-500' : 'border-gray-700'
              }`}
            >
              {!progress.experiences?.has(exp.title) && (
                <div className="absolute bottom-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  +{COMPLETION_XP.EXPERIENCE} XP
                </div>
              )}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 mr-8">
                  <h3 className="text-xl font-semibold text-blue-400 break-normal">{exp.title}</h3>
                  <p className="text-gray-400">{exp.company}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span>{exp.period}</span>
                </div>
              </div>
              {exp.description && (
                <p className="text-gray-300">{exp.description}</p>
              )}
              <div className="mt-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {exp.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;