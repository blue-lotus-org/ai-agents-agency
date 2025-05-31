
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ClipboardDocumentIcon, CheckIcon } from './Icons';

interface CodeDisplayProps {
  code: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy code to clipboard.');
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div className="mt-6 bg-slate-800 bg-opacity-70 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-slate-700 bg-opacity-50 border-b border-slate-600">
        <h3 className="text-lg font-semibold text-purple-300">Generated Agent Code</h3>
        <Button
          onClick={handleCopy}
          variant="secondary"
          className="px-4 py-2 text-sm"
          disabled={copied}
        >
          {copied ? (
            <>
              <CheckIcon className="h-5 w-5 mr-2 text-green-400" /> Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-5 w-5 mr-2" /> Copy Code
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 text-sm text-slate-200 overflow-x-auto max-h-[500px]">
        <code className="font-mono whitespace-pre-wrap break-all">{code}</code>
      </pre>
    </div>
  );
};
