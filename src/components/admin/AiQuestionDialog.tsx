import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { supabase } from '@/lib/supabase';

interface AiQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: any[];
  user: any;
  onSave: (savedQuestions: any[]) => void;
}

export function AiQuestionDialog({ isOpen, onClose, subjects, user, onSave }: AiQuestionDialogProps) {
  const { addToast } = useToast();
  const [aiParams, setAiParams] = useState({ subjectId: '', topic: '', type: 'mcq', difficulty: 'medium', count: 5 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);

  const handleGenerateAiQuestions = async () => {
    if (!aiParams.subjectId || !aiParams.topic || aiParams.count < 1) {
      addToast('Please provide a subject, topic, and valid count.', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const subject = subjects.find(s => s.id === aiParams.subjectId)?.name;
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...aiParams, subject })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.questions && data.questions.length > 0) {
        setAiQuestions(data.questions);
        addToast(`Generated ${data.questions.length} questions. Please review them.`, 'success');
      } else {
        throw new Error('No questions returned');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to generate questions.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAiQuestions = async () => {
    if (aiQuestions.length === 0) return;
    const inserts = aiQuestions.map(q => {
      const type = aiParams.type; // Force strict enum from dropdown
      const base: any = {
        text: q.text,
        type: type,
        marks: q.marks || 2,
        difficulty: aiParams.difficulty,
        topic: aiParams.topic,
        subject_id: aiParams.subjectId,
        created_by: user?.id,
      };

      if (type === 'subjective') {
        base.options = [];
        base.rubric = q.rubric || '';
        base.expected_answer = q.expected_answer || '';
      } else {
        base.options = q.options || [];
      }

      return base;
    });
    
    const { data, error } = await supabase.from('questions').insert(inserts).select();
    if (error) {
      addToast('Failed to save AI questions.', 'error');
      console.error(error);
      return;
    }
    
    addToast('Questions saved successfully.', 'success');
    setAiQuestions([]);
    onSave(data || []);
  };

  const closeDialog = () => {
    setAiQuestions([]);
    onClose();
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text">Generate AI Questions</h3>
          <button onClick={closeDialog} className="text-text-secondary hover:text-text">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1">
          {aiQuestions.length === 0 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-text mb-1.5">Subject *</label>
                <select value={aiParams.subjectId} onChange={e => setAiParams(p => ({ ...p, subjectId: e.target.value }))}
                  className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text mb-1.5">Topic or Syllabus *</label>
                <textarea value={aiParams.topic} onChange={e => setAiParams(p => ({ ...p, topic: e.target.value }))}
                  placeholder="e.g., Binary Search Trees, Big O notation, etc."
                  rows={3} className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Question Type</label>
                  <select value={aiParams.type} onChange={e => setAiParams(p => ({ ...p, type: e.target.value }))}
                    className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="mcq">Multiple Choice</option>
                    <option value="true-false">True / False</option>
                    <option value="multi-select">Multiple Select</option>
                    <option value="subjective">Subjective (AI Eval)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Difficulty</label>
                  <select value={aiParams.difficulty} onChange={e => setAiParams(p => ({ ...p, difficulty: e.target.value }))}
                    className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Count</label>
                  <input type="number" value={aiParams.count} onChange={e => setAiParams(p => ({ ...p, count: Number(e.target.value) }))}
                    className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" min={1} max={20} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text border-b border-border pb-2">Preview Generated Questions ({aiQuestions.length})</h4>
              <div className="space-y-4">
                {aiQuestions.map((q, i) => (
                  <div key={i} className="p-4 bg-surface border border-border rounded-lg relative">
                    <button onClick={() => setAiQuestions(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-3 right-3 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                    <div className="text-sm text-text font-medium pr-6">{q.text}</div>
                    <div className="flex gap-2 mt-2">
                        <span className="text-[10px] uppercase font-semibold text-text-muted bg-bg px-1.5 rounded">{q.type}</span>
                        <span className="text-[10px] text-text-muted bg-bg px-1.5 rounded">{q.marks} marks</span>
                    </div>
                    {q.options && q.options.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {q.options.map((opt: any, j: number) => (
                          <div key={j} className={`text-xs px-2 py-1 rounded ${opt.isCorrect ? 'bg-success/10 text-success-hover font-medium' : 'text-text-secondary'}`}>
                            {String.fromCharCode(65 + j)}. {opt.text}
                          </div>
                        ))}
                      </div>
                    )}
                    {q.expected_answer && (
                      <div className="mt-3 text-xs">
                        <span className="text-text-muted">Expected Answer:</span>
                        <p className="mt-1 text-text-secondary whitespace-pre-wrap">{q.expected_answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-bg rounded-b-lg">
          {aiQuestions.length === 0 ? (
            <>
              <button onClick={closeDialog} disabled={isGenerating}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-sidebar-hover disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleGenerateAiQuestions} disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-wait">
                {isGenerating ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> : <SparklesIcon />}
                {isGenerating ? 'Generating...' : 'Generate Questions'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setAiQuestions([])}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-sidebar-hover">
                Discard & Retry
              </button>
              <button onClick={handleSaveAiQuestions}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover">
                Save Questions
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
