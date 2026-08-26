'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/ui/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, GripVertical } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import type { QuestionType, Difficulty, ExamSettings } from '@/types';
import AiButton from '@/components/animata/button/ai-button';

import { supabase } from '@/lib/supabase';

const steps = ['Details', 'Questions', 'Settings', 'Review'];

export default function CreateExamPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState<any[]>([]);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      if (!user) return;
      setIsLoadingData(true);
      
      let subjectQuery = supabase.from('subjects').select('*');
      if (user.role === 'faculty') {
        subjectQuery = subjectQuery.eq('faculty_id', user.id);
      }
      const { data: subData } = await subjectQuery;
      
      // Fallback: If faculty has no subjects assigned yet in the DB, show all for demo
      if (user.role === 'faculty' && (!subData || subData.length === 0)) {
        const { data: allSub } = await supabase.from('subjects').select('*');
        setSubjects(allSub || []);
      } else {
        setSubjects(subData || []);
      }
      
      const { data: qData } = await supabase.from('questions').select('*');
      setAllQuestions(qData || []);
      
      setIsLoadingData(false);
    }
    loadData();
  }, [user]);

  const [step, setStep] = useState(0);

  // Step 1 — Details
  const [details, setDetails] = useState({
    title: '', subjectId: '', description: '',
    date: '', startTime: '', duration: 60,
    totalMarks: 0, passingMarks: 0,
  });

  // Step 2 — Questions
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);

  // Step 3 — Settings
  const [settings, setSettings] = useState<ExamSettings>({
    shuffleQuestions: false, shuffleOptions: false,
    showResultImmediately: true, allowAnswerReview: true,
    enableNegativeMarking: false, autoSubmitOnTimeEnd: true,
    negativeMarkPercentage: 25,
  });
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // Restore draft from local storage
  React.useEffect(() => {
    const saved = localStorage.getItem('exam_draft_v1');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.step !== undefined) setStep(draft.step);
        if (draft.details) setDetails(draft.details);
        if (draft.selectedQuestionIds) setSelectedQuestionIds(draft.selectedQuestionIds);
        if (draft.settings) setSettings(draft.settings);
        if (draft.attemptsAllowed) setAttemptsAllowed(draft.attemptsAllowed);
      } catch (e) {
        console.error('Failed to parse exam draft', e);
      }
    }
    setIsDraftLoaded(true);
  }, []);

  // Save to local storage on changes
  React.useEffect(() => {
    if (!isDraftLoaded) return;
    const draft = { step, details, selectedQuestionIds, settings, attemptsAllowed };
    localStorage.setItem('exam_draft_v1', JSON.stringify(draft));
  }, [step, details, selectedQuestionIds, settings, attemptsAllowed, isDraftLoaded]);

  // Picker Filters State
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerSort, setPickerSort] = useState('newest');
  const [pickerTopic, setPickerTopic] = useState('');
  const [pickerType, setPickerType] = useState('');

  const subjectQs = useMemo(() => {
    let filtered = allQuestions.filter(q => q.subject_id === details.subjectId && !selectedQuestionIds.includes(q.id));
    
    if (pickerSearch) {
      filtered = filtered.filter(q => q.text.toLowerCase().includes(pickerSearch.toLowerCase()));
    }
    if (pickerTopic) {
      filtered = filtered.filter(q => q.topic === pickerTopic);
    }
    if (pickerType) {
      filtered = filtered.filter(q => q.type === pickerType);
    }
    
    // Sort
    if (pickerSort === 'marks-asc') filtered.sort((a, b) => a.marks - b.marks);
    else if (pickerSort === 'marks-desc') filtered.sort((a, b) => b.marks - a.marks);
    else if (pickerSort === 'difficulty') {
      const weight: any = { easy: 1, medium: 2, hard: 3 };
      filtered.sort((a, b) => (weight[a.difficulty] || 0) - (weight[b.difficulty] || 0));
    } else {
      // newest (assuming id or created_at, fallback to id for stable sort if created_at absent)
      filtered.sort((a, b) => a.id > b.id ? -1 : 1);
    }
    return filtered;
  }, [allQuestions, details.subjectId, selectedQuestionIds, pickerSearch, pickerSort, pickerTopic, pickerType]);

  const availableTopics = useMemo(() => {
    const qs = allQuestions.filter(q => q.subject_id === details.subjectId);
    return Array.from(new Set(qs.map(q => q.topic))).filter(Boolean) as string[];
  }, [allQuestions, details.subjectId]);

  const selectedQs = selectedQuestionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean);
  const totalMarks = selectedQs.reduce((a, q) => a + (q?.marks || 0), 0);

  const handlePublish = async () => {
    if (!details.title || !details.subjectId || !details.date || selectedQuestionIds.length === 0) {
      addToast('Please fill all required fields.', 'error');
      return;
    }

    const { error } = await supabase.from('exams').insert({
      title: details.title,
      description: details.description,
      subject_id: details.subjectId,
      faculty_id: user?.id,
      date: details.date,
      start_time: details.startTime || '09:00',
      duration: details.duration,
      total_marks: totalMarks,
      passing_marks: details.passingMarks || Math.round(totalMarks * 0.4),
      total_questions: selectedQuestionIds.length,
      attempts_allowed: attemptsAllowed,
      status: 'upcoming',
      instructions: [
        `The exam contains ${selectedQuestionIds.length} questions.`,
        `Duration is ${details.duration} minutes.`,
        `Total marks: ${totalMarks}.`,
        'Answers are automatically saved.',
        'The exam will automatically submit when time expires.',
      ],
      settings,
      question_ids: selectedQuestionIds,
    });

    if (error) {
      console.error('Error creating exam:', error);
      addToast('Failed to create exam.', 'error');
      return;
    }

    localStorage.removeItem('exam_draft_v1');
    addToast('Exam published successfully!', 'success');
    router.push('/exams');
  };

  if (isLoadingData) {
    return (
      <div className="max-w-3xl animate-fade-in space-y-8">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <PageHeader title="Create Exam" />
        {isDraftLoaded && localStorage.getItem('exam_draft_v1') && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your draft?')) {
                localStorage.removeItem('exam_draft_v1');
                window.location.reload();
              }
            }}
            className="text-xs font-medium text-text-secondary hover:text-error transition-colors px-3 py-1.5 border border-border rounded-md hover:border-error/30 hover:bg-error/5"
          >
            Clear Draft
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                i === step ? 'bg-primary text-white' :
                i < step ? 'bg-success-light text-success' :
                'bg-bg text-text-secondary border border-border'
              }`}
            >
              {i < step ? <Check size={14} /> : <span className="text-xs">{i + 1}</span>}
              {s}
            </button>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 — Details */}
      {step === 0 && (
        <div className="bg-surface border border-border rounded-lg px-5 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-text mb-1.5">Exam Name *</label>
            <input type="text" value={details.title} onChange={e => setDetails(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Data Structures Midterm"
              className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text mb-1.5">Subject *</label>
            <select value={details.subjectId} onChange={e => setDetails(p => ({ ...p, subjectId: e.target.value }))}
              className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text mb-1.5">Description</label>
            <textarea value={details.description} onChange={e => setDetails(p => ({ ...p, description: e.target.value }))}
              rows={2} className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text mb-1.5">Date *</label>
              <input type="date" value={details.date} onChange={e => setDetails(p => ({ ...p, date: e.target.value }))}
                className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text mb-1.5">Start Time</label>
              <input type="time" value={details.startTime} onChange={e => setDetails(p => ({ ...p, startTime: e.target.value }))}
                className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text mb-1.5">Duration (minutes) *</label>
              <input type="number" value={details.duration} onChange={e => setDetails(p => ({ ...p, duration: Number(e.target.value) }))}
                min={5} className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text mb-1.5">Passing Marks</label>
              <input type="number" value={details.passingMarks} onChange={e => setDetails(p => ({ ...p, passingMarks: Number(e.target.value) }))}
                min={0} className="w-full h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2 — Questions */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-sm text-text-secondary">{selectedQuestionIds.length} questions selected</span>
              <span className="text-sm text-text-muted ml-2">• Total marks: {totalMarks}</span>
            </div>
            <button onClick={() => setShowQuestionPicker(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover">
              <Plus size={14} /> Add from Question Bank
            </button>
          </div>
          <div className="flex justify-end mb-2">
            <AiButton />
          </div>

          {selectedQs.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg py-12 text-center text-sm text-text-secondary">
              No questions added yet. Click &quot;Add from Question Bank&quot; to add questions.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedQs.map((q, i) => q && (
                <div key={q.id} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3">
                  <GripVertical size={14} className="text-text-muted" />
                  <span className="text-xs text-text-muted w-6">{i + 1}.</span>
                  <span className="flex-1 text-sm text-text truncate">{q.text}</span>
                  <span className="text-xs text-text-muted px-2 py-0.5 bg-bg rounded border border-border">{q.marks}m</span>
                  <button onClick={() => setSelectedQuestionIds(prev => prev.filter(id => id !== q.id))}
                    className="p-1 text-text-muted hover:text-error"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Question Picker Dialog */}
          {showQuestionPicker && typeof document !== 'undefined' && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
              <div className="bg-surface rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h3 className="text-base font-semibold text-text">Add Questions from Bank</h3>
                  <button onClick={() => setShowQuestionPicker(false)} className="text-text-secondary hover:text-text text-sm">Close</button>
                </div>
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="px-5 py-3 border-b border-border bg-bg/50 flex flex-wrap gap-3">
                    <input type="text" placeholder="Search questions..." value={pickerSearch} onChange={e => setPickerSearch(e.target.value)}
                      className="flex-1 min-w-[150px] h-8 px-3 text-xs bg-surface border border-border rounded focus:outline-none focus:border-primary" />
                    
                    <select value={pickerTopic} onChange={e => setPickerTopic(e.target.value)}
                      className="h-8 px-2 text-xs bg-surface border border-border rounded text-text-secondary focus:outline-none focus:border-primary">
                      <option value="">All Topics</option>
                      {availableTopics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <select value={pickerType} onChange={e => setPickerType(e.target.value)}
                      className="h-8 px-2 text-xs bg-surface border border-border rounded text-text-secondary focus:outline-none focus:border-primary">
                      <option value="">All Types</option>
                      <option value="mcq">MCQ</option>
                      <option value="true-false">T/F</option>
                      <option value="multi-select">Multi</option>
                      <option value="coding">Coding</option>
                    </select>

                    <select value={pickerSort} onChange={e => setPickerSort(e.target.value)}
                      className="h-8 px-2 text-xs bg-surface border border-border rounded text-text-secondary focus:outline-none focus:border-primary">
                      <option value="newest">Newest First</option>
                      <option value="marks-asc">Marks (Low to High)</option>
                      <option value="marks-desc">Marks (High to Low)</option>
                      <option value="difficulty">Difficulty</option>
                    </select>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-3 min-h-0">
                    {subjectQs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-sm text-text-secondary mb-3">
                          {details.subjectId ? 'No matching questions found.' : 'Please select a subject first.'}
                        </p>
                        {details.subjectId && (
                          <button onClick={() => router.push('/question-bank')} className="text-xs text-primary hover:underline">
                            Go to Question Bank to create more
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center mb-2 px-1">
                           <span className="text-xs font-medium text-text-secondary">{subjectQs.length} questions available</span>
                        </div>
                        {subjectQs.map(q => (
                          <button key={q.id} onClick={() => {
                            setSelectedQuestionIds(prev => [...prev, q.id]);
                          }}
                            className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-md border border-border hover:border-primary hover:bg-primary-light transition-colors text-sm group">
                            <Plus size={14} className="text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                               <span className="block truncate text-text group-hover:whitespace-normal group-hover:break-words">{q.text}</span>
                               <div className="flex gap-2 mt-1">
                                  <span className="text-[10px] uppercase font-semibold text-text-muted bg-bg px-1.5 rounded">{q.type === 'mcq' ? 'MCQ' : q.type === 'true-false' ? 'T/F' : q.type === 'coding' ? '{ }' : 'Multi'}</span>
                                  {q.topic && <span className="text-[10px] text-text-muted bg-bg px-1.5 rounded truncate max-w-[100px]">{q.topic}</span>}
                               </div>
                            </div>
                            <span className="text-xs font-medium text-text-muted whitespace-nowrap bg-bg px-2 py-0.5 rounded border border-border flex items-center gap-1.5">
                               {q.marks}m <span className="w-1 h-1 rounded-full bg-border inline-block"/> {q.difficulty}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-border bg-bg rounded-b-lg">
                  <button onClick={() => setShowQuestionPicker(false)}
                    className="w-full sm:w-auto px-6 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary-hover transition-colors">
                    Done
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </div>
      )}

      {/* Step 3 — Settings */}
      {step === 2 && (
        <div className="bg-surface border border-border rounded-lg px-5 py-5 space-y-4">
          {([
            ['shuffleQuestions', 'Shuffle questions', 'Randomize question order for each student'],
            ['shuffleOptions', 'Shuffle answer options', 'Randomize option order for each question'],
            ['showResultImmediately', 'Show result immediately', 'Display result right after submission'],
            ['allowAnswerReview', 'Allow answer review', 'Let students review correct answers after submission'],
            ['enableNegativeMarking', 'Enable negative marking', 'Deduct marks for incorrect answers'],
            ['autoSubmitOnTimeEnd', 'Auto-submit when time ends', 'Automatically submit when the timer reaches zero'],
          ] as const).map(([key, label, desc]) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox"
                checked={settings[key]}
                onChange={e => setSettings(p => ({ ...p, [key]: e.target.checked }))}
                className="mt-0.5 w-4 h-4 accent-primary" />
              <div>
                <div className="text-sm font-medium text-text">{label}</div>
                <div className="text-xs text-text-secondary">{desc}</div>
              </div>
            </label>
          ))}
          {settings.enableNegativeMarking && (
            <div className="ml-7">
              <label className="block text-[13px] font-medium text-text mb-1.5">Negative marking percentage</label>
              <input type="number" value={settings.negativeMarkPercentage}
                onChange={e => setSettings(p => ({ ...p, negativeMarkPercentage: Number(e.target.value) }))}
                min={0} max={100}
                className="w-32 h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <span className="text-xs text-text-muted ml-2">% of question marks</span>
            </div>
          )}
          <div>
            <label className="block text-[13px] font-medium text-text mb-1.5">Attempts allowed</label>
            <input type="number" value={attemptsAllowed} onChange={e => setAttemptsAllowed(Number(e.target.value))}
              min={1} max={5}
              className="w-32 h-9 px-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-surface border border-border rounded-lg px-5 py-4">
            <h3 className="text-sm font-semibold text-text mb-3">Exam Summary</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-text-secondary">Title</div><div className="font-medium text-text">{details.title || '—'}</div>
              <div className="text-text-secondary">Subject</div><div className="font-medium text-text">{subjects.find(s => s.id === details.subjectId)?.name || '—'}</div>
              <div className="text-text-secondary">Date</div><div className="font-medium text-text">{details.date || '—'}</div>
              <div className="text-text-secondary">Duration</div><div className="font-medium text-text">{details.duration} minutes</div>
              <div className="text-text-secondary">Questions</div><div className="font-medium text-text">{selectedQuestionIds.length}</div>
              <div className="text-text-secondary">Total Marks</div><div className="font-medium text-text">{totalMarks}</div>
              <div className="text-text-secondary">Passing Marks</div><div className="font-medium text-text">{details.passingMarks || Math.round(totalMarks * 0.4)}</div>
              <div className="text-text-secondary">Attempts</div><div className="font-medium text-text">{attemptsAllowed}</div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-lg px-5 py-4">
            <h3 className="text-sm font-semibold text-text mb-3">Settings</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-text-secondary">Shuffle Questions</div><div className="text-text">{settings.shuffleQuestions ? 'Yes' : 'No'}</div>
              <div className="text-text-secondary">Shuffle Options</div><div className="text-text">{settings.shuffleOptions ? 'Yes' : 'No'}</div>
              <div className="text-text-secondary">Negative Marking</div><div className="text-text">{settings.enableNegativeMarking ? `Yes (${settings.negativeMarkPercentage}%)` : 'No'}</div>
              <div className="text-text-secondary">Show Result</div><div className="text-text">{settings.showResultImmediately ? 'Immediately' : 'After review'}</div>
              <div className="text-text-secondary">Auto-submit</div><div className="text-text">{settings.autoSubmitOnTimeEnd ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : router.push('/exams')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-sidebar-hover"
        >
          <ArrowLeft size={16} /> {step === 0 ? 'Cancel' : 'Previous'}
        </button>
        <div className="flex items-center gap-2">
          {step === 3 ? (
            <>
              <button onClick={() => { addToast('Draft saved.', 'success'); }}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-sidebar-hover">
                Save Draft
              </button>
              <button onClick={handlePublish}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover">
                Publish Exam
              </button>
            </>
          ) : (
            <button onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover">
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
