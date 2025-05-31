
import React from 'react';
import { Button } from './Button';
import { LightBulbIcon } from './Icons';

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const TaskInput: React.FC<TaskInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      onSubmit();
    }
  };
  
  return (
    <div className="p-6 bg-slate-800 bg-opacity-50 rounded-xl shadow-2xl border border-slate-700">
      <label htmlFor="taskDescription" className="block text-xl font-semibold mb-3 text-purple-300">
        Describe Your AI Agent's Task
      </label>
      <textarea
        id="taskDescription"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., An agent that summarizes articles, translates text, or answers questions about a specific topic..."
        rows={5}
        className="w-full p-3 bg-slate-700 bg-opacity-70 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
        disabled={isLoading}
      />
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <p className="text-xs text-slate-400">
          Pro Tip: Be specific for better results! (Ctrl+Enter or Cmd+Enter to submit)
        </p>
        <Button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="w-full sm:w-auto px-8 py-3 text-lg"
        >
          {isLoading ? (
            'Generating...'
          ) : (
            <>
              <LightBulbIcon className="h-5 w-5 mr-2" />
              Generate Agent
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
