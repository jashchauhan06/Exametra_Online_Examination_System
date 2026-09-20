'use client';

import React, { useState, useRef } from 'react';
import type { AssignmentSubmission } from '@/types';

interface EvaluationResultProps {
  submission: AssignmentSubmission;
}

export function EvaluationResult({ submission }: EvaluationResultProps) {
  const [expanded, setExpanded] = useState(true);
  const score = submission.score ?? 0;
  const maxMarks = submission.max_marks ?? 100;
  const percentage = maxMarks > 0 ? Math.round((score / maxMarks) * 100) : 0;

  const getGradeColor = () => {
    if (percentage >= 80) return { primary: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', ring: 'rgba(16, 185, 129, 0.2)' };
    if (percentage >= 60) return { primary: '#3B82F6', bg: 'rgba(59, 130, 246, 0.08)', ring: 'rgba(59, 130, 246, 0.2)' };
    if (percentage >= 40) return { primary: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', ring: 'rgba(245, 158, 11, 0.2)' };
    return { primary: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', ring: 'rgba(239, 68, 68, 0.2)' };
  };

  const gradeColor = getGradeColor();

  const getGradeLabel = () => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Above Average';
    if (percentage >= 50) return 'Average';
    if (percentage >= 40) return 'Below Average';
    return 'Needs Improvement';
  };

  // SVG circle progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  if (submission.status === 'evaluating') {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: '#FAFAFA', border: '1px solid #E4E4E7' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-3 border-[#E5E5E5] border-t-[#8B5CF6] animate-spin" 
            style={{ borderWidth: 3 }} />
          <div>
            <p className="text-sm font-semibold text-[#18181B]">AI is evaluating your submission...</p>
            <p className="text-xs text-[#71717A] mt-1">This usually takes 10-30 seconds</p>
          </div>
        </div>
      </div>
    );
  }

  if (submission.status === 'error') {
    return (
      <div className="rounded-2xl p-6" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            ⚠️
          </div>
          <div>
            <p className="text-sm font-semibold text-[#EF4444]">Evaluation Failed</p>
            <p className="text-xs text-[#71717A] mt-0.5">The AI evaluation encountered an error. Please try resubmitting.</p>
          </div>
        </div>
      </div>
    );
  }

  if (submission.status === 'pending') {
    return (
      <div className="rounded-2xl p-6" style={{ background: '#FAFAFA', border: '1px solid #E4E4E7' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
            📋
          </div>
          <div>
            <p className="text-sm font-semibold text-[#18181B]">Submission Received</p>
            <p className="text-xs text-[#71717A] mt-0.5">Your submission is queued for AI evaluation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden animate-page-enter" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between" 
        style={{ background: gradeColor.bg, borderBottom: `1px solid ${gradeColor.ring}` }}>
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold" style={{ color: gradeColor.primary }}>
            AI Evaluation Result
          </h3>
          <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" 
            style={{ background: gradeColor.ring, color: gradeColor.primary }}>
            {getGradeLabel()}
          </span>
        </div>
        <button onClick={() => setExpanded(!expanded)} 
          className="text-xs font-medium text-[#71717A] hover:text-[#18181B] transition-colors">
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {expanded && (
        <div className="p-6">
          <div className="flex items-start gap-8">
            {/* Score Gauge */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-[140px] h-[140px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  {/* Background ring */}
                  <circle cx="64" cy="64" r={radius} fill="none" stroke="#F4F4F5" strokeWidth="8" />
                  {/* Progress ring */}
                  <circle
                    cx="64" cy="64" r={radius} fill="none"
                    stroke={gradeColor.primary}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#18181B]">{score}</span>
                  <span className="text-xs text-[#71717A]">out of {maxMarks}</span>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold" style={{ color: gradeColor.primary }}>{percentage}%</span>
              </div>
            </div>

            {/* Feedback */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mb-3">
                Detailed Feedback
              </h4>
              <div className="text-[13px] leading-relaxed text-[#3F3F46] whitespace-pre-wrap rounded-xl p-4"
                style={{ background: '#FAFAFA', border: '1px solid #F4F4F5' }}>
                {submission.feedback || 'No feedback available.'}
              </div>
              {submission.evaluated_at && (
                <p className="text-[11px] text-[#A1A1AA] mt-3">
                  Evaluated on {new Date(submission.evaluated_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
