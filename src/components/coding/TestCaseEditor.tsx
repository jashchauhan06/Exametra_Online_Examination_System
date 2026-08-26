'use client';

import React from 'react';
import type { TestCase } from '@/types';
import { Plus, Trash2, EyeOff, Eye } from 'lucide-react';

interface TestCaseEditorProps {
  testCases: TestCase[];
  onChange: (testCases: TestCase[]) => void;
}

export default function TestCaseEditor({ testCases, onChange }: TestCaseEditorProps) {
  const addTestCase = () => {
    onChange([
      ...testCases,
      {
        id: `tc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        input: '',
        expected_output: '',
        is_hidden: false,
        points: 1,
      },
    ]);
  };

  const removeTestCase = (id: string) => {
    onChange(testCases.filter(tc => tc.id !== id));
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: any) => {
    onChange(testCases.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Test Cases ({testCases.length})
        </span>
        <button
          type="button"
          onClick={addTestCase}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary bg-primary-light border border-primary/20 rounded hover:bg-primary/10 transition-colors"
        >
          <Plus size={12} /> Add Test Case
        </button>
      </div>

      {testCases.length === 0 && (
        <div className="text-center py-6 text-sm text-text-muted border border-dashed border-border rounded-lg">
          No test cases yet. Add at least one test case.
        </div>
      )}

      {testCases.map((tc, i) => (
        <div key={tc.id} className="bg-surface border border-border rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text">
              Test Case {i + 1}
              {tc.is_hidden && (
                <span className="ml-2 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold uppercase">
                  Hidden
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateTestCase(tc.id, 'is_hidden', !tc.is_hidden)}
                className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                  tc.is_hidden
                    ? 'text-amber-500 hover:bg-amber-50'
                    : 'text-text-muted hover:bg-bg'
                }`}
                title={tc.is_hidden ? 'Make visible to students' : 'Hide from students'}
              >
                {tc.is_hidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                type="button"
                onClick={() => removeTestCase(tc.id)}
                className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded transition-colors"
                title="Delete test case"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Input (stdin)</label>
              <textarea
                value={tc.input}
                onChange={(e) => updateTestCase(tc.id, 'input', e.target.value)}
                placeholder="5 3"
                rows={2}
                className="w-full px-2.5 py-2 text-xs font-mono bg-bg border border-border rounded resize-none focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Expected Output</label>
              <textarea
                value={tc.expected_output}
                onChange={(e) => updateTestCase(tc.id, 'expected_output', e.target.value)}
                placeholder="8"
                rows={2}
                className="w-full px-2.5 py-2 text-xs font-mono bg-bg border border-border rounded resize-none focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Points</label>
              <input
                type="number"
                value={tc.points}
                onChange={(e) => updateTestCase(tc.id, 'points', Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="w-16 h-7 px-2 text-xs bg-bg border border-border rounded text-center focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
