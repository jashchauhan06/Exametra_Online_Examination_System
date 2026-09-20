import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import { fetchSubjects } from '@/lib/data/supabase-service';

interface AssignSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facultyId: string;
  facultyName: string;
  initialAssignedSubjectIds: string[];
  onSuccess: (updatedSubjectIds: string[]) => void;
}

export function AssignSubjectsModal({ isOpen, onClose, facultyId, facultyName, initialAssignedSubjectIds, onSuccess }: AssignSubjectsModalProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialAssignedSubjectIds || []));

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(initialAssignedSubjectIds || []));
      loadSubjects();
    }
  }, [isOpen, initialAssignedSubjectIds]);

  async function loadSubjects() {
    const data = await fetchSubjects();
    setAllSubjects(data || []);
  }

  const toggleSubject = (subjectId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(subjectId)) next.delete(subjectId);
      else next.add(subjectId);
      return next;
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const newSelectedArray = Array.from(selectedIds);
      const initiallyAssigned = new Set(initialAssignedSubjectIds || []);
      
      const added = newSelectedArray.filter(id => !initiallyAssigned.has(id));
      const removed = (initialAssignedSubjectIds || []).filter(id => !selectedIds.has(id));

      // 1. Update the subjects table (assign new subjects to this faculty)
      if (added.length > 0) {
        const { error: errAdded } = await supabase.from('subjects')
          .update({ faculty_id: facultyId })
          .in('id', added);
        if (errAdded) throw errAdded;
      }

      // 2. Update the subjects table (unassign removed subjects)
      if (removed.length > 0) {
        const { error: errRemoved } = await supabase.from('subjects')
          .update({ faculty_id: null })
          .in('id', removed);
        if (errRemoved) throw errRemoved;
      }

      // 3. Update the users table (teaching_subjects array)
      const { error: errUser } = await supabase.from('users')
        .update({ teaching_subjects: newSelectedArray })
        .eq('id', facultyId);
      
      if (errUser) throw errUser;

      addToast('Subjects assigned successfully.', 'success');
      onSuccess(newSelectedArray);
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Failed to assign subjects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-lg font-semibold text-text">Assign Subjects</h3>
            <p className="text-sm text-text-muted mt-1">Assign subjects to {facultyName}</p>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {allSubjects.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">Loading subjects...</div>
          ) : (
            <div className="space-y-2">
              {allSubjects.map(sub => {
                const isSelected = selectedIds.has(sub.id);
                // Highlight if it belongs to someone else
                const isAssignedToOther = sub.faculty_id && sub.faculty_id !== facultyId;
                
                return (
                  <div 
                    key={sub.id} 
                    onClick={() => toggleSubject(sub.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'border-primary/50 bg-primary/5' : 'border-border hover:bg-bg'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                      isSelected ? 'bg-primary border-primary text-white' : 'border-border'
                    }`}>
                      {isSelected && <Check size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{sub.name}</p>
                      <p className="text-xs text-text-muted truncate">{sub.code}</p>
                    </div>
                    {isAssignedToOther && !isSelected && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-error/10 text-error whitespace-nowrap">
                        Assigned to someone else
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border bg-bg/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
