'use client';

import React, { useState, useMemo } from 'react';
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
  });

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
        <AiButton />
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
                const typeLabel = q.type === 'mcq' ? 'MCQ' : q.type === 'true-false' ? 'T/F' : q.type === 'coding' ? '{ }' : 'Multi';
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
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
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
              {newQ.type !== 'coding' && (
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
        </div>
      )}
    </div>
  );
}
