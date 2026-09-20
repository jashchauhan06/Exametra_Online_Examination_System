'use client';

import React, { useState, useRef, useCallback } from 'react';
import type { Assignment, AssignmentSubmission, SubmissionType } from '@/types';
import { useAuth } from '@/lib/auth-context';
import {
  upsertSubmission,
  uploadAssignmentFile,
  updateSubmissionEvaluation,
  updateSubmissionStatus,
} from '@/lib/data/supabase-service';
import { EvaluationResult } from './evaluation-result';
import { FileText, Image as ImageIcon, Type, Upload, X, CheckCircle } from 'lucide-react';

interface SubmissionFormProps {
  assignment: Assignment;
  existingSubmission: AssignmentSubmission | null;
  onSubmissionUpdate: (submission: AssignmentSubmission) => void;
}

export function SubmissionForm({ assignment, existingSubmission, onSubmissionUpdate }: SubmissionFormProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SubmissionType>(() => {
    if (existingSubmission) return existingSubmission.submission_type;
    return assignment.accepted_types?.[0] || 'text';
  });
  const [textContent, setTextContent] = useState(existingSubmission?.text_content || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(existingSubmission?.file_url || null);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(existingSubmission);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDeadlinePassed = new Date(assignment.deadline) < new Date();
  const isAlreadyEvaluated = submission?.status === 'evaluated';
  const canSubmit = !isDeadlinePassed && !submitting;

  const acceptedTypes = assignment.accepted_types || ['text', 'pdf', 'image'];

  const tabs = [
    { id: 'text' as SubmissionType, label: 'Text', icon: Type, accept: '' },
    { id: 'pdf' as SubmissionType, label: 'PDF', icon: FileText, accept: '.pdf' },
    { id: 'image' as SubmissionType, label: 'Image', icon: ImageIcon, accept: 'image/png,image/jpeg,image/jpg,image/webp' },
  ].filter(t => acceptedTypes.includes(t.id));

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    if (activeTab === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(file.name);
    }
  }, [activeTab]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const extractPdfText = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up the worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;
    setSubmitting(true);

    try {
      let fileUrl: string | undefined;
      let fileName: string | undefined;
      let submissionText: string | undefined;

      // 1. Process submission content
      if (activeTab === 'text') {
        if (!textContent.trim()) {
          alert('Please enter your answer text.');
          setSubmitting(false);
          return;
        }
        submissionText = textContent;
      } else if (activeTab === 'pdf' || activeTab === 'image') {
        if (!selectedFile) {
          alert('Please select a file to upload.');
          setSubmitting(false);
          return;
        }
        // Upload file to Supabase Storage
        const url = await uploadAssignmentFile(selectedFile, assignment.id, user.id);
        if (!url) {
          alert('Failed to upload file. Please try again.');
          setSubmitting(false);
          return;
        }
        fileUrl = url;
        fileName = selectedFile.name;

        // For PDF, extract text
        if (activeTab === 'pdf') {
          try {
            submissionText = await extractPdfText(selectedFile);
          } catch (err) {
            console.error('PDF extraction failed:', err);
            submissionText = '[PDF text extraction failed — AI will evaluate based on assignment context]';
          }
        }
      }

      // 2. Save submission to DB
      const savedSubmission = await upsertSubmission({
        assignment_id: assignment.id,
        student_id: user.id,
        submission_type: activeTab,
        text_content: submissionText,
        file_url: fileUrl,
        file_name: fileName,
        max_marks: assignment.max_marks,
        status: 'evaluating',
      });

      if (!savedSubmission) {
        alert('Failed to save submission. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmission(savedSubmission);
      onSubmissionUpdate(savedSubmission);

      // Notify faculty of submission
      fetch('/api/notifications/assignment-submitted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignment.id,
          title: assignment.title,
          facultyId: assignment.faculty_id,
          studentName: user.name,
          studentId: user.id
        })
      }).catch(err => console.error('Failed to notify faculty:', err));

      // 3. Trigger AI evaluation
      try {
        let evalBody: any = {
          assignmentTitle: assignment.title,
          assignmentDescription: assignment.description,
          rubric: assignment.rubric,
          maxMarks: assignment.max_marks,
          submissionType: activeTab,
        };

        if (activeTab === 'image' && selectedFile) {
          const base64 = await fileToBase64(selectedFile);
          evalBody.imageBase64 = base64;
          evalBody.imageMimeType = selectedFile.type;
        } else {
          evalBody.textContent = submissionText;
        }

        const evalResponse = await fetch('/api/evaluate-assignment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(evalBody),
        });

        if (!evalResponse.ok) {
          throw new Error('Evaluation API returned an error');
        }

        const evalResult = await evalResponse.json();

        // 4. Save evaluation result
        await updateSubmissionEvaluation(savedSubmission.id, evalResult.score, evalResult.feedback);

        const updatedSubmission = {
          ...savedSubmission,
          score: evalResult.score,
          feedback: evalResult.feedback,
          status: 'evaluated' as const,
          evaluated_at: new Date().toISOString(),
        };
        setSubmission(updatedSubmission);
        onSubmissionUpdate(updatedSubmission);
      } catch (err) {
        console.error('AI evaluation failed:', err);
        await updateSubmissionStatus(savedSubmission.id, 'error');
        const errorSubmission = { ...savedSubmission, status: 'error' as const };
        setSubmission(errorSubmission);
        onSubmissionUpdate(errorSubmission);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Show existing evaluation result if available */}
      {submission && (submission.status === 'evaluated' || submission.status === 'evaluating' || submission.status === 'error' || submission.status === 'pending') && (
        <EvaluationResult submission={submission} />
      )}

      {/* Submission form (only show if not already evaluated or deadline not passed) */}
      {(!isAlreadyEvaluated || !isDeadlinePassed) && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7' }}>
          {/* Tab Header */}
          <div className="px-6 py-4 flex items-center gap-1" style={{ borderBottom: '1px solid #F4F4F5' }}>
            <span className="text-xs font-semibold text-[#71717A] mr-3">Submit as:</span>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: isActive ? '#18181B' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#71717A',
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}

            {isDeadlinePassed && (
              <span className="ml-auto text-[11px] font-medium text-[#EF4444] px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(239, 68, 68, 0.08)' }}>
                Deadline passed
              </span>
            )}
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'text' && (
              <div>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  disabled={submitting || isDeadlinePassed}
                  placeholder="Type your assignment answer here..."
                  rows={12}
                  className="w-full rounded-xl px-4 py-3 text-[13px] leading-relaxed resize-none outline-none transition-all duration-200"
                  style={{
                    background: '#FAFAFA',
                    border: '1px solid #E4E4E7',
                    color: '#18181B',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[11px] text-[#A1A1AA]">
                    {textContent.length} characters · {textContent.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
              </div>
            )}

            {(activeTab === 'pdf' || activeTab === 'image') && (
              <div>
                {/* Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative rounded-xl p-8 text-center cursor-pointer transition-all duration-200"
                  style={{
                    background: dragOver ? 'rgba(139, 92, 246, 0.04)' : '#FAFAFA',
                    border: `2px dashed ${dragOver ? '#8B5CF6' : '#E4E4E7'}`,
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={tabs.find(t => t.id === activeTab)?.accept}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                    className="hidden"
                    disabled={submitting || isDeadlinePassed}
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      {activeTab === 'image' && filePreview ? (
                        <div className="relative">
                          <img src={filePreview} alt="Preview" className="max-h-48 rounded-lg shadow-sm" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setFilePreview(null); }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#18181B] text-white flex items-center justify-center"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.06)' }}>
                          <CheckCircle size={18} className="text-[#8B5CF6]" />
                          <span className="text-sm font-medium text-[#18181B]">{selectedFile.name}</span>
                          <span className="text-xs text-[#71717A]">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setFilePreview(null); }}
                            className="ml-2 text-[#71717A] hover:text-[#EF4444] transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(139, 92, 246, 0.08)' }}>
                        <Upload size={24} className="text-[#8B5CF6]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#18181B]">
                          Drop your {activeTab === 'pdf' ? 'PDF' : 'image'} here
                        </p>
                        <p className="text-xs text-[#71717A] mt-1">
                          or click to browse · {activeTab === 'pdf' ? '.pdf files' : '.png, .jpg, .jpeg, .webp files'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          {canSubmit && (
            <div className="px-6 pb-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: submitting ? '#A1A1AA' : '#8B5CF6',
                  opacity: submitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#7C3AED'; }}
                onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = '#8B5CF6'; }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Submitting & Evaluating...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    {isAlreadyEvaluated ? 'Resubmit Assignment' : 'Submit for AI Evaluation'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
