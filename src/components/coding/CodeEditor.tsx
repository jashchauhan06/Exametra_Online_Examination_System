'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LanguageSelector from './LanguageSelector';
import { DEFAULT_STARTER_CODE } from '@/lib/judge0';
import type { CodingLanguage } from '@/types';
import { Maximize2, Minimize2, RotateCcw, Settings } from 'lucide-react';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANG_TO_MONACO: Record<string, string> = {
  c: 'c',
  cpp: 'cpp',
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  sql: 'sql',
};

interface CodeEditorProps {
  language: CodingLanguage;
  onLanguageChange: (lang: CodingLanguage) => void;
  code: string;
  onCodeChange: (code: string) => void;
  allowedLanguages?: CodingLanguage[];
  starterCode?: Record<string, string>;
  readOnly?: boolean;
  height?: string;
}

export default function CodeEditor({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  allowedLanguages,
  starterCode,
  readOnly = false,
  height = '400px',
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(14);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLanguageChange = useCallback((newLang: CodingLanguage) => {
    onLanguageChange(newLang);
    // Load starter code for new language if current code is empty or is the old starter code
    const oldStarter = starterCode?.[language] || DEFAULT_STARTER_CODE[language] || '';
    if (!code || code.trim() === '' || code.trim() === oldStarter.trim()) {
      const newStarter = starterCode?.[newLang] || DEFAULT_STARTER_CODE[newLang] || '';
      onCodeChange(newStarter);
    }
  }, [language, code, starterCode, onLanguageChange, onCodeChange]);

  const handleReset = () => {
    const starter = starterCode?.[language] || DEFAULT_STARTER_CODE[language] || '';
    onCodeChange(starter);
  };

  return (
    <div className={`flex flex-col border border-[#3e3e3e] rounded-lg overflow-hidden bg-[#1e1e1e] ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#3e3e3e]">
        <div className="flex items-center gap-2">
          <LanguageSelector
            value={language}
            onChange={handleLanguageChange}
            allowedLanguages={allowedLanguages}
          />
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Editor</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Font size controls */}
          <button
            onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white rounded text-xs"
            title="Decrease font size"
          >
            A-
          </button>
          <span className="text-[10px] text-gray-500 w-6 text-center">{fontSize}</span>
          <button
            onClick={() => setFontSize(Math.min(24, fontSize + 1))}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white rounded text-xs"
            title="Increase font size"
          >
            A+
          </button>
          <div className="w-px h-4 bg-[#3e3e3e] mx-1" />
          {!readOnly && (
            <button
              onClick={handleReset}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-[#3e3e3e] transition-colors"
              title="Reset to starter code"
            >
              <RotateCcw size={13} />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded hover:bg-[#3e3e3e] transition-colors"
            title={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Editor */}
      <Editor
        height={isExpanded ? 'calc(100vh - 120px)' : height}
        language={LANG_TO_MONACO[language] || 'plaintext'}
        value={code}
        onChange={(val) => onCodeChange(val || '')}
        theme="vs-dark"
        options={{
          fontSize,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          automaticLayout: true,
          tabSize: 4,
          readOnly,
          padding: { top: 12 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}
