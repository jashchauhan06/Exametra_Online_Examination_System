'use client';

import React, { useState } from 'react';
import type { TestCase, TestCaseResult } from '@/types';
import { CheckCircle2, XCircle, Clock, AlertTriangle, EyeOff, Play, Loader2 } from 'lucide-react';

interface TestCasePanelProps {
  testCases: TestCase[];
  results?: TestCaseResult[];
  isRunning?: boolean;
  onRun?: () => void;
  compileError?: string;
}

const statusConfig = {
  passed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Passed' },
  failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Wrong Answer' },
  error: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Error' },
  tle: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Time Limit Exceeded' },
  mle: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'Memory Limit Exceeded' },
};

export default function TestCasePanel({ testCases, results, isRunning, onRun, compileError }: TestCasePanelProps) {
  const visibleCases = testCases.filter(tc => !tc.is_hidden);
  const hiddenCases = testCases.filter(tc => tc.is_hidden);
  const [activeTab, setActiveTab] = useState(0);

  const getResultForCase = (tcId: string) => results?.find(r => r.testCaseId === tcId);

  const totalPassed = results?.filter(r => r.passed).length ?? 0;
  const totalRun = results?.length ?? 0;

  return (
    <div className="border border-[#3e3e3e] rounded-lg overflow-hidden bg-[#1e1e1e] mt-3">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#3e3e3e]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Test Cases</span>
          {totalRun > 0 && (
            <span className={`text-xs font-bold ${totalPassed === totalRun ? 'text-green-400' : 'text-red-400'}`}>
              {totalPassed}/{totalRun} Passed
            </span>
          )}
        </div>
        {onRun && (
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
          >
            {isRunning ? (
              <><Loader2 size={12} className="animate-spin" /> Running...</>
            ) : (
              <><Play size={12} /> Run Code</>
            )}
          </button>
        )}
      </div>

      {/* Compile Error */}
      {compileError && (
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold mb-1">
            <AlertTriangle size={14} /> Compilation Error
          </div>
          <pre className="text-red-300 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
            {compileError}
          </pre>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#3e3e3e] overflow-x-auto">
        {visibleCases.map((tc, i) => {
          const result = getResultForCase(tc.id);
          const isActive = activeTab === i;
          return (
            <button
              key={tc.id}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-white bg-[#2d2d2d]'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {result && (
                result.passed
                  ? <CheckCircle2 size={12} className="text-green-400" />
                  : <XCircle size={12} className="text-red-400" />
              )}
              Sample {i + 1}
            </button>
          );
        })}
        {hiddenCases.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-600">
            <EyeOff size={12} />
            +{hiddenCases.length} hidden
          </div>
        )}
      </div>

      {/* Active Test Case Content */}
      {visibleCases[activeTab] && (
        <div className="p-4 space-y-3">
          {(() => {
            const tc = visibleCases[activeTab];
            const result = getResultForCase(tc.id);
            const cfg = result ? statusConfig[result.status] : null;

            return (
              <>
                {/* Status badge */}
                {result && cfg && (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                    <cfg.icon size={12} />
                    {cfg.label}
                    {result.time_ms != null && (
                      <span className="text-gray-500 ml-1">({Math.round(result.time_ms)}ms)</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Input */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Input</div>
                    <pre className="bg-[#2d2d2d] rounded p-2.5 text-xs text-gray-300 font-mono min-h-[48px] max-h-32 overflow-auto whitespace-pre-wrap border border-[#3e3e3e]">
                      {tc.input || '(empty)'}
                    </pre>
                  </div>

                  {/* Expected */}
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Expected Output</div>
                    <pre className="bg-[#2d2d2d] rounded p-2.5 text-xs text-gray-300 font-mono min-h-[48px] max-h-32 overflow-auto whitespace-pre-wrap border border-[#3e3e3e]">
                      {tc.expected_output}
                    </pre>
                  </div>

                  {/* Actual */}
                  {result && (
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Your Output</div>
                      <pre className={`rounded p-2.5 text-xs font-mono min-h-[48px] max-h-32 overflow-auto whitespace-pre-wrap border ${
                        result.passed
                          ? 'bg-green-500/5 text-green-300 border-green-500/20'
                          : 'bg-red-500/5 text-red-300 border-red-500/20'
                      }`}>
                        {result.error || result.actualOutput || '(no output)'}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Hidden test case results summary */}
      {results && hiddenCases.length > 0 && (
        <div className="border-t border-[#3e3e3e] px-4 py-3">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">Hidden Test Cases</div>
          <div className="flex flex-wrap gap-2">
            {hiddenCases.map((tc, i) => {
              const result = getResultForCase(tc.id);
              return (
                <div
                  key={tc.id}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${
                    result
                      ? result.passed
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-[#2d2d2d] text-gray-500 border-[#3e3e3e]'
                  }`}
                >
                  <EyeOff size={10} />
                  Hidden {i + 1}
                  {result && (result.passed ? <CheckCircle2 size={10} /> : <XCircle size={10} />)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
