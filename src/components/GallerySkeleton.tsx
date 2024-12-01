import React from 'react';

export function GallerySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <div 
            key={index} 
            className="break-inside-avoid mb-4"
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-700" style={{ paddingBottom: '75%' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <div className="h-5 bg-gray-600/50 rounded"></div>
                  <div className="h-3 bg-gray-600/50 rounded w-2/3"></div>
                </div>
              </div>
              {/* XP indicator skeleton */}
              <div className="absolute top-2 right-2 bg-gray-600/50 rounded-full h-5 w-14"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 