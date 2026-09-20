'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createAssignment, fetchSubjects } from '@/lib/data/supabase-service';
import type { SubmissionType } from '@/types';
import { ArrowLeft, Save, FileText, Image as ImageIcon, Type } from 'lucide-react';
import Link from 'next/link';

export default function CreateAssignmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [rubric, setRubric] = useState('');
  const [acceptedTypes, setAcceptedTypes] = useState<SubmissionType[]>(['text', 'pdf', 'image']);
  const [status, setStatus] = useState<'active' | 'draft'>('active');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadSubjects() {
      const subs = await fetchSubjects();
      setSubjects(subs);
      if (subs.length > 0) setSubjectId(subs[0].id);
    }
    loadSubjects();
  }, []);

  // Redirect non-faculty users
  if (user && user.role !== 'faculty') {
    router.replace('/assignments');
    return null;
  }

  const toggleType = (type: SubmissionType) => {
    setAcceptedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !description.trim() || !subjectId || !deadline) {
      alert('Please fill in all required fields.');
      return;
    }
    if (acceptedTypes.length === 0) {
      alert('Please select at least one accepted submission type.');
      return;
    }

    setSaving(true);
    try {
      let attachmentUrl = undefined;
      let attachmentType = undefined;
      
      // We need a dummy ID for the attachment path before the assignment is created, 
      // or we can generate a UUID beforehand.
      // But simpler: just create the assignment first without attachment, then upload and update it.
      
      const newAssignmentData = {
        title: title.trim(),
        description: description.trim(),
        subject_id: subjectId,
        faculty_id: user.id,
        deadline: new Date(deadline).toISOString(),
        max_marks: maxMarks,
        rubric: rubric.trim() || undefined,
        accepted_types: acceptedTypes,
        status,
      };

      const result = await createAssignment(newAssignmentData);

      if (result) {
        if (attachmentFile) {
          const { uploadTeacherAttachment, updateAssignment } = await import('@/lib/data/supabase-service');
          const uploadRes = await uploadTeacherAttachment(attachmentFile, result.id);
          if (uploadRes) {
            await updateAssignment(result.id, { 
              attachment_url: uploadRes.url, 
              attachment_type: uploadRes.type 
            });
          }
        }
        router.push('/assignments');
      } else {
        alert('Failed to create assignment. Please try again.');
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const typeOptions = [
    { id: 'text' as SubmissionType, label: 'Text', description: 'Students type their answer', icon: Type },
    { id: 'pdf' as SubmissionType, label: 'PDF', description: 'Upload PDF documents', icon: FileText },
    { id: 'image' as SubmissionType, label: 'Image', description: 'Upload photos or screenshots', icon: ImageIcon },
  ];

  const inputStyle = {
    background: '#FAFAFA',
    border: '1px solid #E4E4E7',
    color: '#18181B',
  };

  return (
    <div className="max-w-3xl animate-page-enter">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/assignments"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: '#F4F4F5' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E4E7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#F4F4F5'; }}
        >
          <ArrowLeft size={16} className="text-[#71717A]" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#18181B] tracking-tight">Create Assignment</h1>
          <p className="text-xs text-[#71717A] mt-0.5">Set up a new assignment with AI-powered auto-evaluation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7' }}>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-2">Assignment Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Data Structures Lab Assignment 1"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the assignment in detail — what students need to do, any specific requirements, formatting guidelines, etc."
                required
                rows={5}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all duration-200"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18181B] mb-2">Attachment (Optional PDF/Image)</label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; }}
              />
              <p className="text-[11px] text-[#71717A] mt-1">Upload a question paper, reference material, or image diagram.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-2">Subject *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; }}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-2">Deadline *</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-2">Maximum Marks *</label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  min={1}
                  max={1000}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'draft')}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 appearance-none cursor-pointer"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; }}
                >
                  <option value="active">Active (visible to students)</option>
                  <option value="draft">Draft (hidden)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rubric */}
        <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7' }}>
          <div>
            <label className="block text-xs font-semibold text-[#18181B] mb-1">
              Grading Rubric / Evaluation Criteria
            </label>
            <p className="text-[11px] text-[#71717A] mb-3">
              This guides the AI evaluator. Be specific about what you expect — the more detail, the better the evaluation.
            </p>
            <textarea
              value={rubric}
              onChange={(e) => setRubric(e.target.value)}
              placeholder={`Example:\n- Correctness of the solution (40%)\n- Code quality and clean structure (20%)\n- Proper explanation and comments (20%)\n- Edge cases handled (10%)\n- Formatting and presentation (10%)`}
              rows={7}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all duration-200"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E4E4E7'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Accepted Types */}
        <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid #E4E4E7' }}>
          <label className="block text-xs font-semibold text-[#18181B] mb-1">Accepted Submission Types</label>
          <p className="text-[11px] text-[#71717A] mb-4">Select which formats students can submit</p>
          <div className="grid grid-cols-3 gap-3">
            {typeOptions.map(opt => {
              const Icon = opt.icon;
              const selected = acceptedTypes.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleType(opt.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 text-center"
                  style={{
                    background: selected ? 'rgba(139, 92, 246, 0.06)' : '#FAFAFA',
                    border: `1.5px solid ${selected ? '#8B5CF6' : '#E4E4E7'}`,
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: selected ? 'rgba(139, 92, 246, 0.12)' : '#F4F4F5' }}>
                    <Icon size={18} style={{ color: selected ? '#8B5CF6' : '#71717A' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: selected ? '#8B5CF6' : '#18181B' }}>
                    {opt.label}
                  </span>
                  <span className="text-[10px]" style={{ color: '#A1A1AA' }}>{opt.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/assignments"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#71717A] transition-colors"
            style={{ background: '#F4F4F5' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#E4E4E7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F4F4F5'; }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
            style={{ background: saving ? '#A1A1AA' : '#8B5CF6' }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = '#7C3AED'; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.background = '#8B5CF6'; }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save size={16} />
                Create Assignment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
