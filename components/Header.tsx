
import React from 'react';
import { CpuChipIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-3xl text-center">
      <div className="inline-flex items-center space-x-3 p-2">
        <CpuChipIcon className="h-12 w-12 text-purple-400 animate-pulse" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
          AI Agent Genesis
        </h1>
      </div>
      <p className="mt-2 text-lg text-slate-300">
        Craft intelligent agent code with the power of AI.
      </p>
    </header>
  );
};
