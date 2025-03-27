import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { COMPLETION_XP } from '../types/game';
import { education } from '../data/gameData';

function Education() {
  const { addProgress, progress } = useGame();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50" id="education">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <GraduationCap className="text-green-400 w-8 h-8" />
          <h2 className="text-4xl font-bold text-center">Education Quest</h2>
        </div>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <div
              key={index}
              onClick={() => addProgress({ type: 'VIEW_EDUCATION', id: edu.school })}
              className={`relative bg-gray-800/100 rounded-lg p-8 hover:bg-gray-800/90 transition-all duration-300 cursor-pointer border ${
                progress.education?.has(edu.school) ? 'border-green-500' : 'border-gray-700'
              }`}
            >
              {!progress.education?.has(edu.school) && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  +{COMPLETION_XP.EDUCATION} XP
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-400">{edu.school}</h3>
                  <p className="text-gray-300">{edu.degree}</p>
                  {edu.gpa && <p className="text-gray-400 mt-2">GPA: {edu.gpa}</p>}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span>{edu.period}</span>
                </div>
              </div>
              {edu.description && (
                <p className="text-gray-300 mt-4">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education; 