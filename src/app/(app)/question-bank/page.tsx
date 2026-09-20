'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { Search, Plus, BookOpen, Trash2, X, Code2 } from 'lucide-react';
import { fetchQuestions, fetchSubjects } from '@/lib/data/supabase-service';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import type { QuestionType, Difficulty, QuestionOption, TestCase, CodingLanguage } from '@/types';
import AiButton from '@/components/animata/button/ai-button';
import TestCaseEditor from '@/components/coding/TestCaseEditor';
import { SUPPORTED_LANGUAGES, DEFAULT_STARTER_CODE } from '@/lib/judge0';

export default function QuestionBankPage() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [baseQuestions, setBaseQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [qData, sData] = await Promise.all([
          fetchQuestions(user?.role === 'faculty' ? user.id : undefined),
          fetchSubjects()
        ]);
        setBaseQuestions(qData);
        setSubjects(sData);
      } catch (err) {
        console.error('Failed to load question bank', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) loadData();
  }, [user]);

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // New question form state
  const [newQ, setNewQ] = useState({
    text: '', type: 'mcq' as QuestionType, marks: 2, difficulty: 'medium' as Difficulty, topic: '', subjectId: '',
    options: [
      { id: 'new_a', text: '', isCorrect: false },
      { id: 'new_b', text: '', isCorrect: false },
      { id: 'new_c', text: '', isCorrect: false },
      { id: 'new_d', text: '', isCorrect: false },
    ] as QuestionOption[],
    // Coding fields
    coding_languages: ['python'] as CodingLanguage[],
    test_cases: [] as TestCase[],
    time_limit_ms: 2000,
    memory_limit_kb: 128000,
    // Subjective fields
    rubric: '',
    expected_answer: '',
  });

  // AI Generation state
  const [showAiDialog, setShowAiDialog] = useState(false);
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
      const type = aiParams.type; // Force strict enum from dropdown, ignore LLM's string representation
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
    setBaseQuestions(prev => [...(data || []), ...prev]);
    setAiQuestions([]);
    setShowAiDialog(false);
    setAiParams({ subjectId: '', topic: '', type: 'mcq', difficulty: 'medium', count: 5 });
    addToast(`Successfully saved ${data?.length} questions.`, 'success');
  };

  const questions = useMemo(() => {
    let filtered = [...baseQuestions];
    if (subjectFilter) filtered = filtered.filter(q => q.subject_id === subjectFilter);
    if (typeFilter) filtered = filtered.filter(q => q.type === typeFilter);
    if (difficultyFilter) filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(q => q.text.toLowerCase().includes(s));
    }

    if (sortFilter === 'marks-asc') filtered.sort((a, b) => a.marks - b.marks);
    else if (sortFilter === 'marks-desc') filtered.sort((a, b) => b.marks - a.marks);
    else if (sortFilter === 'difficulty') {
      const weight: any = { easy: 1, medium: 2, hard: 3 };
      filtered.sort((a, b) => (weight[a.difficulty] || 0) - (weight[b.difficulty] || 0));
    }
    else if (sortFilter === 'alpha') filtered.sort((a, b) => a.text.localeCompare(b.text));
    else filtered.sort((a, b) => a.id > b.id ? -1 : 1); // newest

    return filtered;
  }, [baseQuestions, search, subjectFilter, typeFilter, difficultyFilter, sortFilter]);

  const allTopics = [...new Set(baseQuestions.map(q => q.topic))].sort();

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === questions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(questions.map(q => q.id)));
    }
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selected);
    const { error } = await supabase.from('questions').delete().in('id', idsToDelete);
    if (error) {
      addToast('Failed to delete questions.', 'error');
      return;
    }
    
    setBaseQuestions(prev => prev.filter(q => !selected.has(q.id)));
    setSelected(new Set());
    setShowDeleteDialog(false);
    addToast(`${selected.size} question(s) deleted.`, 'success');
  };

  const handleAddQuestion = async () => {
    if (!newQ.text || !newQ.subjectId) {
      addToast('Please fill all required fields.', 'error');
      return;
    }

    if (newQ.type !== 'coding' && (newQ.options.some(o => !o.text) || !newQ.options.some(o => o.isCorrect))) {
      addToast('Please fill all options and select at least one correct answer.', 'error');
      return;
    }

    if (newQ.type === 'coding' && newQ.test_cases.length === 0) {
      addToast('Please add at least one test case for coding questions.', 'error');
      return;
    }

    const insertData: any = {
      text: newQ.text,
      type: newQ.type,
      marks: newQ.marks,
      difficulty: newQ.difficulty,
      topic: newQ.topic || 'General',
      subject_id: newQ.subjectId,
      created_by: user?.id,
    };

    if (newQ.type === 'coding') {
      insertData.options = [];
      insertData.coding_languages = newQ.coding_languages;
      insertData.starter_code = Object.fromEntries(newQ.coding_languages.map(l => [l, DEFAULT_STARTER_CODE[l] || '']));
      insertData.test_cases = newQ.test_cases;
      insertData.time_limit_ms = newQ.time_limit_ms;
      insertData.memory_limit_kb = newQ.memory_limit_kb;
    } else if (newQ.type === 'subjective') {
      insertData.options = [];
      insertData.rubric = newQ.rubric;
      insertData.expected_answer = newQ.expected_answer;
    } else {
      insertData.options = newQ.options;
    }
    const { data, error } = await supabase.from('questions').insert(insertData).select().single();

    if (error) {
      addToast('Failed to create question.', 'error');
      console.error(error);
      return;
    }

    setBaseQuestions(prev => [data, ...prev]);
    setShowAddDialog(false);
    setNewQ({
      text: '', type: 'mcq', marks: 2, difficulty: 'medium', topic: '', subjectId: newQ.subjectId,
      options: [
        { id: `new_${Date.now()}_a`, text: '', isCorrect: false },
        { id: `new_${Date.now()}_b`, text: '', isCorrect: false },
        { id: `new_${Date.now()}_c`, text: '', isCorrect: false },
        { id: `new_${Date.now()}_d`, text: '', isCorrect: false },
      ],
      coding_languages: ['python'],
      test_cases: [],
      time_limit_ms: 2000,
      memory_limit_kb: 128000,
      rubric: '',
      expected_answer: '',
    });
    addToast('Question added successfully.', 'success');
  };

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Question Bank"
        actions={
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors"
          >
            <Plus size={16} /> Add Question
          </button>
        }
      />
      
      <div className="flex justify-end mb-2">
        <AiButton onClick={() => setShowAiDialog(true)} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-text-muted"
          />
        </div>
        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-surface border border-border rounded-md text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-surface border border-border rounded-md text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Types</option>
          <option value="mcq">Multiple Choice</option>
          <option value="true-false">True / False</option>
          <option value="multi-select">Multiple Select</option>
          <option value="coding">Coding</option>
          <option value="subjective">Subjective</option>
        </select>
        <select value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-surface border border-border rounded-md text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select value={sortFilter} onChange={e => setSortFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-surface border border-border rounded-md text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="newest">Newest First</option>
          <option value="alpha">Alphabetical (Spot Dups)</option>
          <option value="marks-asc">Marks (Low to High)</option>
          <option value="marks-desc">Marks (High to Low)</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 px-4 py-2 bg-primary-light border border-[#BFDBFE] rounded-md text-sm">
          <span className="font-medium text-primary">{selected.size} selected</span>
          <button onClick={() => setShowDeleteDialog(true)} className="flex items-center gap-1 text-error hover:underline">
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-text-secondary hover:text-text">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="w-10 px-4 py-2.5"></th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Question</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Subject</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Topic</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Difficulty</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Marks</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-4" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : questions.length === 0 ? (
        <EmptyState icon={BookOpen} title="No questions found" description="Add questions to build your question bank." />
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="w-10 px-4 py-2.5">
                  <input type="checkbox" checked={selected.size === questions.length && questions.length > 0}
                    onChange={toggleSelectAll} className="w-3.5 h-3.5 accent-primary" />
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Question</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Subject</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Topic</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Difficulty</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Marks</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(q => {
                const subject = subjects.find(s => s.id === q.subject_id);
                const typeLabel = q.type === 'mcq' ? 'MCQ' : q.type === 'true-false' ? 'T/F' : q.type === 'coding' ? '{ }' : q.type === 'subjective' ? 'Subj' : 'Multi';
                return (
                  <tr key={q.id} className="border-b border-border last:border-b-0 hover:bg-bg/50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(q.id)} onChange={() => toggleSelect(q.id)}
                        className="w-3.5 h-3.5 accent-primary" />
                    </td>
                    <td className="px-4 py-3 text-text max-w-xs truncate">{q.text}</td>
                    <td className="px-4 py-3 text-text-secondary">{subject?.code || '—'}</td>
                    <td className="px-4 py-3 text-text-secondary">{q.topic}</td>
                    <td className="px-4 py-3 text-text-secondary">{typeLabel}</td>
                    <td className="px-4 py-3"><StatusBadge variant={q.difficulty} /></td>
                    <td className="px-4 py-3 text-text-secondary">{q.marks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete questions?"
        message={`Are you sure you want to delete ${selected.size} question(s)? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDeleteSelected}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {/* Add Question Dialog */}
      {showAddDialog && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-surface rounded-lg border border-border shadow-lg w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface z-10">
              <h3 className="text-base font-semibold text-text">Add Question</h3>
              <button onClick={() => setShowAddDialog(false)} className="p-1 rounded-md hover:bg-sidebar-hover text-text-secondary">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-[13px] font-medium text-text mb-1.5">Subject</label>
                <select value={newQ.subjectId} onChange={e => setNewQ(p => ({ ...p, subjectId: e.target.value }))}
                  className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Select subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              {/* Question Text */}
              <div>
                <label className="block text-[13px] font-medium text-text mb-1.5">Question</label>
                <textarea value={newQ.text} onChange={e => setNewQ(p => ({ ...p, text: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
              {/* Type & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Type</label>
                  <select value={newQ.type} onChange={e => setNewQ(p => ({ ...p, type: e.target.value as QuestionType }))}
                    className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="mcq">Multiple Choice</option>
                    <option value="true-false">True / False</option>
                    <option value="multi-select">Multiple Select</option>
                    <option value="coding">Coding</option>
                    <option value="subjective">Subjective (AI Evaluated)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Difficulty</label>
                  <select value={newQ.difficulty} onChange={e => setNewQ(p => ({ ...p, difficulty: e.target.value as Difficulty }))}
                    className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              {/* Topic & Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Topic</label>
                  <input type="text" value={newQ.topic} onChange={e => setNewQ(p => ({ ...p, topic: e.target.value }))}
                    className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Marks</label>
                  <input type="number" value={newQ.marks} onChange={e => setNewQ(p => ({ ...p, marks: Number(e.target.value) }))}
                    className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" min={1} />
                </div>
              </div>
              {/* Options (MCQ/TF/Multi only) */}
              {newQ.type !== 'coding' && newQ.type !== 'subjective' && (
              <div>
                <label className="block text-[13px] font-medium text-text mb-1.5">Options</label>
                <div className="space-y-2">
                  {newQ.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type={newQ.type === 'multi-select' ? 'checkbox' : 'radio'} name="correct_answer"
                        checked={opt.isCorrect}
                        onChange={() => {
                          setNewQ(p => ({
                            ...p,
                            options: p.options.map((o, j) => ({
                              ...o,
                              isCorrect: p.type === 'multi-select' ? (j === i ? !o.isCorrect : o.isCorrect) : j === i,
                            })),
                          }));
                        }}
                        className="w-4 h-4 accent-primary" />
                      <input type="text" value={opt.text} placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        onChange={e => {
                          setNewQ(p => ({
                            ...p,
                            options: p.options.map((o, j) => j === i ? { ...o, text: e.target.value } : o),
                          }));
                        }}
                        className="flex-1 h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  ))}
                </div>
              </div>
              )}
              {/* Subjective Question Fields */}
              {newQ.type === 'subjective' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-text mb-1.5">Expected Answer</label>
                    <textarea value={newQ.expected_answer} onChange={e => setNewQ(p => ({ ...p, expected_answer: e.target.value }))}
                      placeholder="Enter the ideal answer for the AI to compare against"
                      rows={3} className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text mb-1.5">Grading Rubric (Optional)</label>
                    <textarea value={newQ.rubric} onChange={e => setNewQ(p => ({ ...p, rubric: e.target.value }))}
                      placeholder="e.g. 1 mark for mentioning X, 1 mark for Y. Deduct marks for poor grammar."
                      rows={3} className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                  </div>
                </div>
              )}
              {/* Coding Question Fields */}
              {newQ.type === 'coding' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-text mb-1.5">Allowed Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <label key={lang.key} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface border border-border rounded-md cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={newQ.coding_languages.includes(lang.key as CodingLanguage)}
                          onChange={(e) => {
                            setNewQ(p => ({
                              ...p,
                              coding_languages: e.target.checked
                                ? [...p.coding_languages, lang.key as CodingLanguage]
                                : p.coding_languages.filter(l => l !== lang.key),
                            }));
                          }}
                          className="w-3.5 h-3.5 accent-primary"
                        />
                        <span className="text-xs font-medium text-text-secondary">{lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-text mb-1.5">Time Limit (ms)</label>
                    <input type="number" value={newQ.time_limit_ms} onChange={e => setNewQ(p => ({ ...p, time_limit_ms: Number(e.target.value) }))}
                      className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" min={500} step={500} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-text mb-1.5">Memory Limit (KB)</label>
                    <input type="number" value={newQ.memory_limit_kb} onChange={e => setNewQ(p => ({ ...p, memory_limit_kb: Number(e.target.value) }))}
                      className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" min={16000} step={16000} />
                  </div>
                </div>
                <TestCaseEditor
                  testCases={newQ.test_cases}
                  onChange={(tc) => setNewQ(p => ({ ...p, test_cases: tc }))}
                />
              </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-bg rounded-b-lg">
              <button onClick={() => setShowAddDialog(false)}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-sidebar-hover">
                Cancel
              </button>
              <button onClick={handleAddQuestion}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover">
                Add Question
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* AI Dialogs */}
      {showAiDialog && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
          <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text">Generate AI Questions</h3>
              <button onClick={() => { setShowAiDialog(false); setAiQuestions([]); }} className="text-text-secondary hover:text-text"><X size={20} /></button>
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
                  <button onClick={() => setShowAiDialog(false)} disabled={isGenerating}
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
                    Save to Question Bank
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
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
