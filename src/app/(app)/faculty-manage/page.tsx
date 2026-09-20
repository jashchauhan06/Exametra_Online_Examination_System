'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { Search, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { AssignSubjectsModal } from '@/components/admin/AssignSubjectsModal';
import { fetchSubjects } from '@/lib/data/supabase-service';

export default function FacultyManagePage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ id: string; name: string; action: 'disable' | 'enable' } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignSubjectData, setAssignSubjectData] = useState<{ id: string; name: string; assignedIds: string[] } | null>(null);
  const [, forceUpdate] = useState(0);

  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [facRes, subRes] = await Promise.all([
        supabase.from('users').select('*').eq('role', 'faculty'),
        fetchSubjects()
      ]);
      setFacultyList(facRes.data || []);
      setSubjects(subRes);
      setLoading(false);
    }
    loadData();
  }, []);

  const filtered = facultyList.filter(f => {
    if (search && !f.name?.toLowerCase().includes(search.toLowerCase()) && !f.faculty_id?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleToggleStatus = async () => {
    if (!confirmAction) return;
    const isActive = confirmAction.action === 'enable';
    const { error } = await supabase.from('users').update({ is_active: isActive }).eq('id', confirmAction.id);
    
    if (error) {
      addToast('Failed to update faculty status.', 'error');
    } else {
      addToast(`Faculty ${confirmAction.action === 'disable' ? 'disabled' : 'enabled'} successfully.`, 'success');
      setFacultyList(prev => prev.map(f => f.id === confirmAction.id ? { ...f, is_active: isActive } : f));
    }
    
    setConfirmAction(null);
  };

  return (
    <div className="max-w-5xl">
      <PageHeader 
        title="Faculty Management" 
        subtitle="Manage faculty accounts and permissions." 
        actions={
          user?.role === 'admin' ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white text-[13px] font-medium rounded-lg hover:bg-black/80 transition-colors"
            >
              <UserPlus size={16} />
              Add Faculty
            </button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search faculty..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted" />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Faculty</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Faculty ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Department</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Subjects</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-6 w-8 ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-500">No faculty found.</td></tr>
            ) : filtered.map(f => (
              <tr key={f.id} className="border-b border-border last:border-b-0 hover:bg-bg/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-text">{f.name}</div>
                  <div className="text-xs text-text-muted">{f.designation}</div>
                </td>
                <td className="px-4 py-3 text-text-secondary">{f.faculty_id}</td>
                <td className="px-4 py-3 text-text-secondary">{f.department}</td>
                <td className="px-4 py-3 text-text-secondary">
                  {(f.teaching_subjects || []).map((sid: string) => subjects.find(s => s.id === sid)?.name).filter(Boolean).join(', ') || <span className="text-text-muted italic">None</span>}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge variant={f.is_active ? 'active' : 'inactive'} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => setAssignSubjectData({ id: f.id, name: f.name, assignedIds: f.teaching_subjects || [] })}
                      className="px-3 py-1.5 text-[13px] font-medium text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded transition-colors whitespace-nowrap"
                    >
                      Assign Subjects
                    </button>
                    <button
                      onClick={() => setConfirmAction({ id: f.id, name: f.name, action: f.is_active ? 'disable' : 'enable' })}
                      className={`px-3 py-1.5 text-[13px] font-medium border rounded transition-colors whitespace-nowrap ${
                        f.is_active 
                          ? 'text-error bg-error/5 hover:bg-error/10 border-error/20 hover:border-error/40' 
                          : 'text-success bg-success/5 hover:bg-success/10 border-success/20 hover:border-success/40'
                      }`}
                    >
                      {f.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!confirmAction}
        title={`${confirmAction?.action === 'disable' ? 'Disable' : 'Enable'} faculty?`}
        message={`Are you sure you want to ${confirmAction?.action} ${confirmAction?.name}?`}
        confirmText={confirmAction?.action === 'disable' ? 'Disable' : 'Enable'}
        variant={confirmAction?.action === 'disable' ? 'danger' : 'default'}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
      />

      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newUser) => {
          setShowCreateModal(false);
          addToast(`Faculty ${newUser.name} created successfully!`, 'success');
          setFacultyList(prev => [newUser, ...prev]);
        }}
      />

      <AssignSubjectsModal 
        isOpen={!!assignSubjectData}
        onClose={() => setAssignSubjectData(null)}
        facultyId={assignSubjectData?.id || ''}
        facultyName={assignSubjectData?.name || ''}
        initialAssignedSubjectIds={assignSubjectData?.assignedIds || []}
        onSuccess={(updatedSubjectIds) => {
          setFacultyList(prev => prev.map(f => f.id === assignSubjectData?.id ? { ...f, teaching_subjects: updatedSubjectIds } : f));
          setAssignSubjectData(null);
        }}
      />
    </div>
  );
}
