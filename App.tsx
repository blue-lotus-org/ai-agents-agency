
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { CodeDisplay } from './components/CodeDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Button } from './components/Button';
import { generateAgentCode } from './services/geminiService';
import { SparklesIcon, ExclamationTriangleIcon } from './components/Icons';

const App: React.FC = () => {
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);

  const handleGenerateAgent = useCallback(async () => {
    if (!taskDescription.trim()) {
      setError('Please enter a task description for your AI agent.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedCode('');
    setShowDisclaimer(false); // Hide disclaimer once generation starts

    try {
      const code = await generateAgentCode(taskDescription);
      setGeneratedCode(code);
    } catch (err) {
      console.error('Error generating agent code:', err);
      if (err instanceof Error) {
        setError(`Failed to generate agent code: ${err.message}. Please check your API key and network.`);
      } else {
        setError('An unknown error occurred while generating the agent code.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [taskDescription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8 selection:bg-pink-500 selection:text-white">
      <Header />
      
      <main className="w-full max-w-3xl mt-8 space-y-8">
        <TaskInput
          value={taskDescription}
          onChange={setTaskDescription}
          onSubmit={handleGenerateAgent}
          isLoading={isLoading}
        />

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-6 bg-slate-800 bg-opacity-50 rounded-lg shadow-xl">
            <LoadingSpinner />
            <p className="mt-3 text-lg text-purple-300 animate-pulse">Crafting your AI agent...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-800 bg-opacity-70 border border-red-600 text-red-100 rounded-lg shadow-lg flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-300 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {generatedCode && !isLoading && (
          <CodeDisplay code={generatedCode} />
        )}

        {showDisclaimer && !generatedCode && !isLoading && !error && (
          <div className="p-6 bg-slate-800 bg-opacity-70 rounded-lg shadow-xl border border-purple-700">
            <div className="flex items-center space-x-3 mb-3">
              <SparklesIcon className="h-8 w-8 text-purple-400" />
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Welcome to AI Agent Genesis!</h2>
            </div>
            <p className="text-slate-300 mb-2">
              Describe the task for your AI agent, and we'll generate starter JavaScript code for you.
            </p>
            <p className="text-xs text-slate-400">
              Example: "Create an agent that translates English text to French." or "Build a simple calculator agent."
            </p>
            <p className="text-xs text-slate-500 mt-4">
              Note: Ensure your Gemini API key is correctly configured in the environment variables. The generated code is a starting point and may require adjustments.
            </p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl mt-12 text-center text-sm text-slate-500 pb-8">
        <p>&copy; 2023-{new Date().getFullYear()} AI Agent Genesis. All generated code should be reviewed before use.</p>
        <p>BLUE LOTUS, aka <a href="https://lotuschain.org">LotusChain</a></p>
      </footer>
    </div>
  );
};

export default App;
