import React from 'react';

export function XPTooltip({ amount }: { amount: number }) {
  return (
    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
      +{amount} XP
    </div>
  );
} 