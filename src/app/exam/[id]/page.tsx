'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Clock, Save, AlertTriangle } from 'lucide-react';
import { getDynamicExamStatus } from '@/lib/utils/exam-status';
import { supabase } from '@/lib/supabase';
import type { StudentAnswer, QuestionNavStatus, CodingLanguage, TestCaseResult, CodingSubmission } from '@/types';
import dynamic from 'next/dynamic';
const CodeEditor = dynamic(() => import('@/components/coding/CodeEditor'), { ssr: false });
import TestCasePanel from '@/components/coding/TestCasePanel';
import { DEFAULT_STARTER_CODE } from '@/lib/judge0';

export default function ExamTakePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { addToast } = useToast();

  const examId = params.id as string;
  const [exam, setExam] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [lockdownTimer, setLockdownTimer] = useState(45);
  const [warnings, setWarnings] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastViolationTimeRef = useRef<number>(0);

  // Coding question state
  const [codingAnswers, setCodingAnswers] = useState<Record<string, CodingSubmission>>({});
  const [codingResults, setCodingResults] = useState<Record<string, TestCaseResult[]>>({});
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [compileError, setCompileError] = useState<string | undefined>();

  const examRef = useRef(exam);
  const userRef = useRef(user);

  useEffect(() => {
    examRef.current = exam;
    userRef.current = user;
  }, [exam, user]);

  const triggerViolation = React.useCallback((voiceMessage: string) => {
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 2000) return; // Debounce events within 2s
    lastViolationTimeRef.current = now;

    // Notify Faculty
    const currentExam = examRef.current;
    const currentUser = userRef.current;

    if (currentExam?.faculty_id && currentUser) {
      fetch('/api/notifications/notify-faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyId: currentExam.faculty_id,
          title: `Exam Violation: ${currentUser.name || currentUser.email}`,
          message: `Student navigated away or lost focus during exam "${currentExam.title}": ${voiceMessage}`,
          type: 'exam-violation'
        })
      }).catch(err => console.error('Failed to notify faculty:', err));
    }

    // Voice Warning
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voiceMessage);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }

    setWarnings(prev => {
      const next = prev + 1;
      // We can't safely call submitRef here if it's not initialized or stable,
      // but submitRef is a ref to the submit function, so it should be fine.
      if (next >= 2) {
        setTimeout(() => {
          if (submitRef.current) submitRef.current(true, 'Exceeded maximum warnings (2) for exiting exam environment');
        }, 0);
      }
      return next;
    });
  }, [exam, user]);

  // Monitor Fullscreen Status
  useEffect(() => {
    setIsFullscreen(!!document.fullscreenElement);
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (!isFS) {
        triggerViolation("Your test will end if you go out");
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [triggerViolation]);

  // Anti-Cheat: Screen Obfuscation & Screenshot Blocking
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard.writeText('Screenshots are disabled.');
        triggerViolation("Screenshots are strictly prohibited.");
      }
      
      // Block Mac/Windows screenshot shortcuts (Cmd/Win + Shift + 3/4/5/S)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        navigator.clipboard.writeText('Screenshots are disabled.');
        triggerViolation("Screenshots are strictly prohibited.");
      }

      // Block Copy/Paste/Print
      if ((e.metaKey || e.ctrlKey) && ['c', 'v', 'p', 'C', 'V', 'P'].includes(e.key)) {
        e.preventDefault();
        addToast("Action not allowed during exam", "error");
      }
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
      triggerViolation("Window focus lost. Please return immediately.");
    };

    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    // Block right click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [triggerViolation, addToast]);

  // Initialize exam
  useEffect(() => {
    if (isLoading || !user) return;

    async function loadData() {
      const { data: examData } = await supabase.from('exams').select('*').eq('id', examId).single();
      if (!examData) {
        router.replace('/exams');
        return;
      }
      
      const dynamicStatus = getDynamicExamStatus(examData);
      if (dynamicStatus !== 'live') {
        addToast(`This exam is currently ${dynamicStatus} and cannot be taken right now.`, 'error');
        router.replace(`/exams/${examId}`);
        return;
      }

      setExam(examData);

      const { data: subData } = await supabase.from('subjects').select('*').eq('id', examData.subject_id).single();
      setSubject(subData);

      // Load questions
      const qIds = examData.question_ids || [];
      if (qIds.length > 0) {
        const { data: qData } = await supabase.from('questions').select('*').in('id', qIds);
        setQuestions(qData || []);
      }

      // Check existing attempt
      const { data: existing } = await supabase.from('exam_attempts')
        .select('*')
        .eq('exam_id', examId)
        .eq('student_id', user!.id)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      if (existing && existing.status !== 'in-progress') {
        router.replace('/exams');
        return;
      }

      let currentAttemptId = existing?.id;
      if (!existing && !attemptId) {
        const { data: newAtt } = await supabase.from('exam_attempts').insert({
          exam_id: examId,
          student_id: user!.id,
          status: 'in-progress'
        }).select().single();
        if (newAtt) currentAttemptId = newAtt.id;
      }
      setAttemptId(currentAttemptId || null);

      let loadedFromLocal = false;
      const savedState = localStorage.getItem(`exam_${examId}_state`);
      if (savedState) {
        try {
          const state = JSON.parse(savedState);
          // Only consider local state valid if it actually has answers. 
          // Otherwise, it might be a blank state from an accidental auto-save.
          if (state.answers && Object.keys(state.answers).length > 0) {
            setAnswers(state.answers);
            setMarkedForReview(new Set(state.markedForReview || []));
            setVisitedQuestions(new Set(state.visitedQuestions || []));
            setCurrentQ(state.currentQ || 0);
            if (state.warnings) setWarnings(state.warnings);
            if (state.attemptId) setAttemptId(state.attemptId);
            if (state.startTime) startTimeRef.current = state.startTime;
            loadedFromLocal = true;
          }
        } catch { /* ignore */ }
      }

      // If not in localStorage but we have an existing attempt, load from DB
      if (!loadedFromLocal && existing && existing.answers && Array.isArray(existing.answers) && existing.answers.length > 0) {
        const dbAnswers: Record<string, string[]> = {};
        const dbMarked = new Set<string>();
        const dbVisited = new Set<string>();
        
        existing.answers.forEach((ans: any) => {
          if (ans.selectedOptionIds && ans.selectedOptionIds.length > 0) {
            dbAnswers[ans.questionId] = ans.selectedOptionIds;
          }
          if (ans.isMarkedForReview) {
            dbMarked.add(ans.questionId);
          }
          dbVisited.add(ans.questionId);
        });

        setAnswers(dbAnswers);
        setMarkedForReview(dbMarked);
        setVisitedQuestions(dbVisited);
        
        if (existing.time_spent) {
           startTimeRef.current = Date.now() - (existing.time_spent * 1000);
        }
      }

      // Calculate time remaining based on DB time_spent or started_at if resuming
      let timeSecs = examData.duration * 60;
      if (existing) {
        if (existing.time_spent) {
           timeSecs = Math.max(0, timeSecs - existing.time_spent);
        } else if (existing.started_at) {
           const elapsed = Math.floor((Date.now() - new Date(existing.started_at).getTime()) / 1000);
           // Only deduct if we didn't load a fresh local state that already handled it
           if (!loadedFromLocal) {
             timeSecs = Math.max(0, timeSecs - elapsed);
           }
        }
      }
      setTimeRemaining(timeSecs);

      if (qIds.length > 0) {
        setVisitedQuestions(prev => new Set([...prev, qIds[0]]));
      }

      setLoadingData(false);
    }

    loadData();

    // Anti-cheat: Fullscreen & Disable Screenshots
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        navigator.clipboard.writeText(''); 
        addToast('Screenshots are disabled during the exam.', 'error');
      }
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleSelectStart = (e: Event) => e.preventDefault();
    const handleDragStart = (e: DragEvent) => e.preventDefault();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        addToast('Warning: Do not switch tabs during the exam!', 'error');
        triggerViolation("Your test will end if you go out");
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    const handleWindowBlur = () => {
      addToast('Warning: Exam window lost focus!', 'error');
      triggerViolation("Your test will end if you go out");
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Warn before leaving
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Timer
  useEffect(() => {
    if (timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining > 0]);

  // Auto-save to localStorage
  useEffect(() => {
    const state = {
      answers,
      markedForReview: Array.from(markedForReview),
      visitedQuestions: Array.from(visitedQuestions),
      currentQ,
      attemptId,
      warnings,
      startTime: startTimeRef.current,
    };
    localStorage.setItem(`exam_${examId}_state`, JSON.stringify(state));
    setLastSaved(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [answers, markedForReview, visitedQuestions, currentQ, attemptId, examId, warnings]);

  // Format timer
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarningTime = timeRemaining > 0 && timeRemaining <= 300;

  // Answer handlers
  const handleSelectOption = (questionId: string, optionId: string, isMulti: boolean) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (isMulti) {
        // Toggle for multi-select
        const newAnswers = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return { ...prev, [questionId]: newAnswers };
      }
      // Single select
      return { ...prev, [questionId]: [optionId] };
    });
  };

  const handleClearResponse = () => {
    const q = questions[currentQ];
    if (q) {
      setAnswers(prev => {
        const next = { ...prev };
        delete next[q.id];
        return next;
      });
    }
  };

  const handleMarkForReview = () => {
    const q = questions[currentQ];
    if (q) {
      setMarkedForReview(prev => {
        const next = new Set(prev);
        if (next.has(q.id)) {
          next.delete(q.id);
        } else {
          next.add(q.id);
        }
        return next;
      });
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQ(index);
    if (questions[index]) {
      setVisitedQuestions(prev => new Set([...prev, questions[index].id]));
    }
  };

  const handleSaveNext = () => {
    if (currentQ < questions.length - 1) {
      goToQuestion(currentQ + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQ > 0) {
      goToQuestion(currentQ - 1);
    }
  };

  const getQuestionStatus = useCallback((qId: string): QuestionNavStatus => {
    if (markedForReview.has(qId)) return 'marked';
    if (answers[qId] && answers[qId].length > 0) return 'answered';
    if (visitedQuestions.has(qId)) return 'not-answered';
    return 'not-visited';
  }, [answers, markedForReview, visitedQuestions]);

  // Submission
  const handleSubmitExam = useCallback(async (isForcedViolation = false, violationReason?: string) => {
    if (!attemptId || !exam || isSubmitting || !user) return;

    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    const studentAnswers: StudentAnswer[] = questions.map(q => ({
      questionId: q.id,
      selectedOptionIds: answers[q.id] || [],
      isMarkedForReview: markedForReview.has(q.id),
      answeredAt: answers[q.id] ? new Date().toISOString() : undefined,
      timeTaken: 0,
    }));

    // Calculate result locally
    let obtainedMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const questionResults = [];
    
    for (const q of questions) {
      let marksAwarded = 0;
      let marksDeducted = 0;
      let isCorrect = false;

      if (q.type === 'coding') {
        const codingAns = codingAnswers[q.id];
        if (!codingAns || !codingAns.code.trim()) {
          unansweredCount++;
          questionResults.push({
            questionId: q.id,
            studentAnswer: [],
            correctAnswer: [],
            isCorrect: false,
            marksAwarded: 0,
            marksDeducted: 0,
            codingResult: null
          });
        } else {
          // Evaluate against ALL test cases for final submission
          try {
            const res = await fetch('/api/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: codingAns.code,
                language: codingAns.language,
                testCases: q.test_cases || [],
              }),
            });
            const data = await res.json();
            
            if (!data.error && data.results) {
              const passedCount = data.totalPassed || 0;
              const totalCases = data.totalCases || 1;
              const ratio = passedCount / totalCases;
              
              if (ratio === 1) {
                isCorrect = true;
                correctCount++;
              } else if (ratio === 0) {
                incorrectCount++;
              }
              
              marksAwarded = parseFloat((q.marks * ratio).toFixed(2));
              obtainedMarks += marksAwarded;

              questionResults.push({
                questionId: q.id,
                studentAnswer: [codingAns.code],
                correctAnswer: [],
                isCorrect: ratio === 1,
                marksAwarded,
                marksDeducted: 0,
                codingResult: {
                  language: codingAns.language,
                  code: codingAns.code,
                  results: data.results,
                  totalPassed: passedCount,
                  totalCases: totalCases
                }
              });
            } else {
              throw new Error(data.error || 'Execution failed');
            }
          } catch (err) {
            console.error('Final code evaluation failed:', err);
            incorrectCount++;
            questionResults.push({
              questionId: q.id,
              studentAnswer: [codingAns.code],
              correctAnswer: [],
              isCorrect: false,
              marksAwarded: 0,
              marksDeducted: 0,
              codingResult: { error: 'Failed to evaluate code' }
            });
          }
        }
      } else if (q.type === 'subjective') {
        const studentAns = answers[q.id]?.[0] || '';
        if (!studentAns.trim()) {
          unansweredCount++;
          questionResults.push({
            questionId: q.id,
            studentAnswer: [],
            correctAnswer: [],
            isCorrect: false,
            marksAwarded: 0,
            marksDeducted: 0,
            feedback: 'No answer provided.'
          });
        } else {
          try {
            const res = await fetch('/api/evaluate-subjective', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                questionId: q.id,
                questionText: q.text,
                studentAnswer: studentAns,
                rubric: q.rubric,
                expectedAnswer: q.expected_answer,
                maxMarks: q.marks
              }),
            });
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);

            const awarded = parseFloat(Number(data.score).toFixed(2));
            obtainedMarks += awarded;
            
            if (awarded === q.marks) {
              correctCount++;
              isCorrect = true;
            } else if (awarded === 0) {
              incorrectCount++;
            }

            questionResults.push({
              questionId: q.id,
              studentAnswer: [studentAns],
              correctAnswer: [],
              isCorrect: awarded > 0,
              marksAwarded: awarded,
              marksDeducted: 0,
              feedback: data.feedback
            });
          } catch (err) {
            console.error('Subjective evaluation failed:', err);
            incorrectCount++;
            questionResults.push({
              questionId: q.id,
              studentAnswer: [studentAns],
              correctAnswer: [],
              isCorrect: false,
              marksAwarded: 0,
              marksDeducted: 0,
              feedback: 'Evaluation failed due to server error.'
            });
          }
        }
      } else {
        const studentAns = answers[q.id] || [];
        const correctAns = q.options.filter((o: any) => o.isCorrect).map((o: any) => o.id);
        
        if (studentAns.length === 0) {
          unansweredCount++;
        } else {
          const isMatch = studentAns.length === correctAns.length && studentAns.every((id: string) => correctAns.includes(id));
          if (isMatch) {
            isCorrect = true;
            marksAwarded = q.marks;
            obtainedMarks += q.marks;
            correctCount++;
          } else {
            incorrectCount++;
            if (exam.settings?.enableNegativeMarking) {
              const deduction = (q.marks * (exam.settings.negativeMarkPercentage || 0)) / 100;
              marksDeducted = deduction;
              obtainedMarks -= deduction;
            }
          }
        }
        
        questionResults.push({
          questionId: q.id,
          studentAnswer: studentAns,
          correctAnswer: correctAns,
          isCorrect,
          marksAwarded,
          marksDeducted
        });
      }
    }
    
    const percentage = Math.max(0, Math.round((obtainedMarks / exam.total_marks) * 100));
    const status = obtainedMarks >= (exam.passing_marks || 0) ? 'passed' : 'failed';
    
    // Save result (upsert to handle retries — unique constraint on attempt_id)
    const { data: resData, error: resError } = await supabase.from('results').upsert({
      attempt_id: attemptId,
      exam_id: exam.id,
      student_id: user.id,
      total_marks: exam.total_marks,
      obtained_marks: obtainedMarks,
      percentage,
      status,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      unanswered_count: unansweredCount,
      time_spent: timeSpent,
      question_results: questionResults,
      is_violation: isForcedViolation,
      violation_reason: violationReason
    }, { onConflict: 'attempt_id' }).select().single();

    if (resError) console.error('Result save error:', resError);
    
    // Update attempt
    const { error: attError } = await supabase.from('exam_attempts').update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      answers: JSON.parse(JSON.stringify(studentAnswers)),
      time_spent: timeSpent,
      is_violation: isForcedViolation,
      violation_reason: violationReason
    }).eq('id', attemptId);

    if (attError) console.error('Attempt update error:', attError);

    // Clean up localStorage
    localStorage.removeItem(`exam_${examId}_state`);

    if (resData) {
      // Show processing state briefly
      setTimeout(() => {
        router.push(`/results/${resData.id}`);
      }, 1500);
    } else {
      addToast('Failed to submit exam. Please try again.', 'error');
      setIsSubmitting(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, exam, isSubmitting, answers, codingAnswers, markedForReview, questions, examId, user, router, addToast]);

  // Keep a stable ref to the submit function to avoid dependency cycles in timers
  const submitRef = useRef(handleSubmitExam);
  useEffect(() => {
    submitRef.current = handleSubmitExam;
  }, [handleSubmitExam]);

  // Lockdown Timer (45s auto-submit)
  useEffect(() => {
    if (!isFullscreen) {
      setLockdownTimer(45);
      const interval = setInterval(() => {
        setLockdownTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            submitRef.current(true, 'Failed to return to fullscreen within 45 seconds');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  // Anti-Extension / Tab Throttling Detection
  useEffect(() => {
    let lastTime = performance.now();
    let animFrame: number;

    const checkThrottle = () => {
      const now = performance.now();
      if (now - lastTime > 2000) {
        // Tab was throttled (likely in background) for >2s
        submitRef.current(true, 'Detected background tab throttling (bypassed active window restrictions)');
      }
      lastTime = now;
      animFrame = requestAnimationFrame(checkThrottle);
    };
    animFrame = requestAnimationFrame(checkThrottle);
    return () => cancelAnimationFrame(animFrame);
  }, []);
  const answeredCount = questions.filter(q => answers[q.id]?.length > 0).length;
  const unansweredCount = questions.filter(q => visitedQuestions.has(q.id) && (!answers[q.id] || answers[q.id].length === 0)).length;
  const markedCount = markedForReview.size;
  const notVisitedCount = questions.filter(q => !visitedQuestions.has(q.id)).length;

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
        <header className="h-[60px] border-b border-[#F4F4F5] bg-white flex items-center justify-between px-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </header>
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 border-r border-[#F4F4F5]">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
              </div>
              <Skeleton className="h-8 w-3/4 mb-10" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <Skeleton key={i} className="h-14 w-full rounded-md" />
                ))}
              </div>
            </div>
          </main>
          <aside className="w-[300px] bg-white hidden lg:flex flex-col">
            <div className="p-5 border-b border-[#F4F4F5]">
              <Skeleton className="h-5 w-24 mb-4" />
              <div className="grid grid-cols-5 gap-2">
                {[...Array(20)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (!exam || !user || questions.length === 0) return null;

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center select-none">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text mb-1">Evaluating your responses...</h2>
          <p className="text-sm text-text-secondary">Please wait while we process your submission.</p>
        </div>
      </div>
    );
  }

  if (!isWindowFocused) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <AlertTriangle size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Exam Focus Lost</h1>
        <p className="text-lg text-gray-300 max-w-md mb-8">
          You have clicked out of the exam window. Screenshots and background tools are strictly prohibited.
        </p>
        <button 
          onClick={() => {
            // Usually, clicking here will trigger focus event and restore state
          }} 
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md font-medium text-white transition-colors">
          Click here to return to exam
        </button>
      </div>
    );
  }

  if (!isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#111] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-6" />
        <h1 className="text-2xl font-bold mb-4">Exam Paused</h1>
        <p className="text-gray-300 mb-2 max-w-md">
          You have exited fullscreen mode. For security reasons, this exam must be taken in fullscreen. 
          Your progress is safely saved.
        </p>

        {warnings < 2 ? (
          <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg font-medium text-sm mb-6 border border-red-500/20">
            Warning {warnings} of 2. On your 2nd warning, the exam will be automatically submitted.
          </div>
        ) : (
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm mb-6 shadow-lg shadow-red-900/20">
            Final Warning Exceeded. Auto-submitting exam...
          </div>
        )}
        
        <div className="bg-[#1A1A1A] border border-red-500/30 rounded-xl px-8 py-5 mb-8 text-center flex flex-col items-center">
          <div className="text-sm text-red-400 font-medium mb-1 uppercase tracking-wider">Auto-Submit In</div>
          <div className="text-5xl font-bold text-red-500 font-mono tracking-tight">
            00:{lockdownTimer.toString().padStart(2, '0')}
          </div>
        </div>

        <button
          onClick={async () => {
            try {
              await document.documentElement.requestFullscreen();
            } catch (e) {
              addToast('Failed to enter fullscreen. Please try again.', 'error');
            }
          }}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-900/20"
        >
          Return to Exam
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQ];
  const isCoding = currentQuestion?.type === 'coding';
  const isSubjective = currentQuestion?.type === 'subjective';
  const isMultiSelect = currentQuestion?.type === 'multi-select';
  const selectedAnswers = answers[currentQuestion.id] || [];

  // Coding helpers
  const currentCodingAnswer = codingAnswers[currentQuestion?.id] || {
    questionId: currentQuestion?.id,
    language: (currentQuestion?.coding_languages?.[0] || 'python') as CodingLanguage,
    code: currentQuestion?.starter_code?.[currentQuestion?.coding_languages?.[0] || 'python'] || DEFAULT_STARTER_CODE[currentQuestion?.coding_languages?.[0] || 'python'] || '',
  };

  const handleRunCode = async () => {
    if (!currentQuestion || isRunningCode) return;
    setIsRunningCode(true);
    setCompileError(undefined);

    const visibleCases = (currentQuestion.test_cases || []).filter((tc: any) => !tc.is_hidden);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCodingAnswer.code,
          language: currentCodingAnswer.language,
          testCases: visibleCases,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setCompileError(data.error);
      } else {
        setCodingResults(prev => ({ ...prev, [currentQuestion.id]: data.results }));
        // Check for compile errors in results
        const errResult = data.results.find((r: any) => r.status === 'error' && r.error);
        if (errResult) setCompileError(errResult.error);
      }

      // Mark as answered
      setCodingAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          ...currentCodingAnswer,
          results: data.results,
          totalPassed: data.totalPassed,
          totalCases: data.totalCases,
        },
      }));

      // Also mark in the answers map so navigation shows it as answered
      if (currentCodingAnswer.code.trim()) {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: ['code_submitted'] }));
      }
    } catch (err: any) {
      setCompileError(err.message || 'Failed to execute code');
    } finally {
      setIsRunningCode(false);
    }
  };

  const navStatusColors: Record<QuestionNavStatus, string> = {
    'answered': 'bg-primary text-white border-primary',
    'not-answered': 'bg-error-light text-error border-[#FECACA]',
    'marked': 'bg-warning-light text-warning border-[#FDE68A]',
    'not-visited': 'bg-surface text-text-secondary border-border',
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col select-none" style={{ WebkitUserSelect: 'none', userSelect: 'none' }} onContextMenu={(e) => e.preventDefault()}>
      {/* Header */}
      <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-10">
        <div>
          <div className="text-sm font-semibold text-text">{exam.title}</div>
          <div className="text-xs text-text-secondary">{subject?.name}</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Save size={14} />
          {lastSaved ? `Saved at ${lastSaved}` : 'Saving...'}
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-mono font-semibold ${
            isWarningTime ? 'bg-error-light text-error' : 'bg-bg text-text'
          }`}>
            <Clock size={15} className={isWarningTime ? 'text-error' : 'text-text-secondary'} />
            {formatTimer(timeRemaining)} remaining
          </div>
          <button
            onClick={() => setShowSubmitDialog(true)}
            className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Area — 75% */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Question Header */}
            <div className="relative flex items-center justify-between mb-6">
              <canvas className="absolute inset-0 w-full h-full z-10 opacity-0 cursor-default" aria-hidden="true" />
              <span className="text-sm font-semibold text-text">
                Question {currentQ + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-secondary px-2 py-1 bg-bg rounded border border-border">
                  {currentQuestion.type === 'mcq' ? 'Multiple Choice' : currentQuestion.type === 'true-false' ? 'True / False' : currentQuestion.type === 'coding' ? 'Coding' : currentQuestion.type === 'subjective' ? 'Subjective' : 'Multiple Select'}
                </span>
                <span className="text-xs text-text-secondary px-2 py-1 bg-bg rounded border border-border">
                  +{currentQuestion.marks} marks
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="relative text-[15px] text-text leading-relaxed mb-6 select-none">
              <canvas className="absolute inset-0 w-full h-full z-10 opacity-0 cursor-default" aria-hidden="true" />
              {currentQuestion.text}
            </div>

            {/* Options / Code Editor */}
            {isCoding ? (
              <div className="mb-8">
                <CodeEditor
                  language={currentCodingAnswer.language}
                  onLanguageChange={(lang) => {
                    setCodingAnswers(prev => ({
                      ...prev,
                      [currentQuestion.id]: {
                        ...currentCodingAnswer,
                        language: lang,
                        code: currentQuestion.starter_code?.[lang] || DEFAULT_STARTER_CODE[lang] || currentCodingAnswer.code,
                      },
                    }));
                  }}
                  code={currentCodingAnswer.code}
                  onCodeChange={(code) => {
                    setCodingAnswers(prev => ({
                      ...prev,
                      [currentQuestion.id]: { ...currentCodingAnswer, code },
                    }));
                    // Mark as answered if code is non-empty
                    if (code.trim()) {
                      setAnswers(prev => ({ ...prev, [currentQuestion.id]: ['code_submitted'] }));
                    }
                  }}
                  allowedLanguages={currentQuestion.coding_languages}
                  starterCode={currentQuestion.starter_code}
                  height="350px"
                />
                <TestCasePanel
                  testCases={currentQuestion.test_cases || []}
                  results={codingResults[currentQuestion.id]}
                  isRunning={isRunningCode}
                  onRun={handleRunCode}
                  compileError={compileError}
                />
              </div>
            ) : isSubjective ? (
              <div className="mb-8 relative z-20">
                <label className="block text-sm font-medium text-text mb-2">Your Answer</label>
                <textarea
                  value={selectedAnswers[0] || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAnswers(prev => {
                      const next = { ...prev };
                      if (val.trim()) {
                        next[currentQuestion.id] = [val];
                      } else {
                        delete next[currentQuestion.id];
                      }
                      return next;
                    });
                  }}
                  placeholder="Type your answer here..."
                  rows={8}
                  className="w-full px-4 py-3 text-[15px] bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                  onPaste={(e) => {
                    e.preventDefault();
                    addToast('Pasting is not allowed during the exam.', 'error');
                  }}
                />
              </div>
            ) : (
            <div className="space-y-2.5 mb-8">
              {isMultiSelect && (
                <p className="text-xs text-text-muted mb-1">Select all that apply</p>
              )}
              {currentQuestion.options.map((option: any, oi: number) => {
                const isSelected = selectedAnswers.includes(option.id);
                const letter = String.fromCharCode(65 + oi);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.id, option.id, isMultiSelect)}
                    className={`relative w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border transition-all select-none ${
                      isSelected
                        ? 'border-primary bg-primary-light'
                        : 'border-border bg-surface hover:border-border-strong'
                    }`}
                  >
                    <canvas className="absolute inset-0 w-full h-full z-10 opacity-0 cursor-pointer" aria-hidden="true" />
                    <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full border-2 text-xs font-medium ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border-strong text-text-secondary'
                    }`}>
                      {isMultiSelect ? (isSelected ? '✓' : '') : letter}
                    </div>
                    <span className={`text-sm ${isSelected ? 'text-text font-medium' : 'text-text'}`}>
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <button
                onClick={handlePrevious}
                disabled={currentQ === 0}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-sidebar-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkForReview}
                  className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                    markedForReview.has(currentQuestion.id)
                      ? 'bg-warning-light text-warning border-[#FDE68A]'
                      : 'text-text-secondary bg-surface border-border hover:bg-sidebar-hover'
                  }`}
                >
                  {markedForReview.has(currentQuestion.id) ? 'Marked for Review' : 'Mark for Review'}
                </button>
                <button
                  onClick={handleClearResponse}
                  className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-sidebar-hover transition-colors"
                >
                  Clear Response
                </button>
              </div>
              <button
                onClick={handleSaveNext}
                disabled={currentQ === questions.length - 1}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigator — 25% */}
        <div className="w-[280px] bg-surface border-l border-border overflow-y-auto flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text mb-3">Questions</h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {([
                ['answered', 'Answered'],
                ['not-answered', 'Not Answered'],
                ['marked', 'Marked'],
                ['not-visited', 'Not Visited'],
              ] as [QuestionNavStatus, string][]).map(([status, label]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className={`w-4 h-4 rounded border text-[9px] flex items-center justify-center ${navStatusColors[status]}`}>
                    {status === 'answered' ? '✓' : ''}
                  </div>
                  <span className="text-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => {
                const status = getQuestionStatus(q.id);
                const isCurrent = i === currentQ;
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(i)}
                    className={`w-full aspect-square rounded-md border text-xs font-medium flex items-center justify-center transition-all ${
                      isCurrent ? 'ring-2 ring-primary ring-offset-1 ' : ''
                    }${navStatusColors[status]}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 border-t border-border space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-text-secondary">Answered</span><span className="font-medium text-text">{answeredCount}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Unanswered</span><span className="font-medium text-text">{unansweredCount}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Marked for Review</span><span className="font-medium text-text">{markedCount}</span></div>
            <div className="flex justify-between"><span className="text-text-secondary">Not Visited</span><span className="font-medium text-text">{notVisitedCount}</span></div>
          </div>
        </div>
      </div>

      {/* Submit Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        title="Submit examination?"
        message="Once submitted, your answers cannot be changed."
        confirmText="Submit Examination"
        cancelText="Continue Exam"
        onConfirm={() => {
          setShowSubmitDialog(false);
          handleSubmitExam();
        }}
        onCancel={() => setShowSubmitDialog(false)}
      >
        <div className="space-y-2 text-sm">
          {unansweredCount > 0 && (
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle size={14} />
              <span>You have {unansweredCount + notVisitedCount} unanswered question{(unansweredCount + notVisitedCount) !== 1 ? 's' : ''}.</span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-2 bg-bg rounded-md border border-border">
              <div className="text-lg font-semibold text-success">{answeredCount}</div>
              <div className="text-[11px] text-text-secondary">Answered</div>
            </div>
            <div className="text-center p-2 bg-bg rounded-md border border-border">
              <div className="text-lg font-semibold text-error">{unansweredCount + notVisitedCount}</div>
              <div className="text-[11px] text-text-secondary">Unanswered</div>
            </div>
            <div className="text-center p-2 bg-bg rounded-md border border-border">
              <div className="text-lg font-semibold text-warning">{markedCount}</div>
              <div className="text-[11px] text-text-secondary">Review</div>
            </div>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  );
}
