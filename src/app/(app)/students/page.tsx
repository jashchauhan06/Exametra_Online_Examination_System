'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/components/ui/toast';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function StudentsPage() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ id: string; name: string; action: 'disable' | 'enable' } | null>(null);
  const [, forceUpdate] = useState(0);

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      const { data } = await supabase.from('users').select('*').eq('role', 'student');
      setStudents(data || []);
      setLoading(false);
    }
    loadStudents();
  }, []);

  const departments = [...new Set(students.map(s => s.department).filter(Boolean))];

  const filtered = students.filter(s => {
    if (search && !s.name?.toLowerCase().includes(search.toLowerCase()) && !s.student_id?.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter && s.department !== deptFilter) return false;
    return true;
  });

  const handleToggleStatus = async () => {
    if (!confirmAction) return;
    const isActive = confirmAction.action === 'enable';
    
    const { error } = await supabase.from('users').update({ is_active: isActive }).eq('id', confirmAction.id);
    
    if (error) {
      addToast('Failed to update student status.', 'error');
    } else {
      addToast(`Student ${confirmAction.action === 'disable' ? 'disabled' : 'enabled'} successfully.`, 'success');
      setStudents(prev => prev.map(s => s.id === confirmAction.id ? { ...s, is_active: isActive } : s));
    }
    
    setConfirmAction(null);
  };

  return (
    <div className="max-w-5xl">
      <PageHeader title="Students" subtitle="Manage student accounts." />

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full h-9 pl-9 pr-3 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="h-9 px-3 text-sm bg-surface border border-border rounded-md text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Student</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Student ID</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Email</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Department</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Semester</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Status</th>
              <th className="text-right px-4 py-2.5 text-xs font-medium text-text-secondary uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-12" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-6 w-8 ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-500">No students found.</td></tr>
            ) : filtered.map(student => (
              <tr key={student.id} className="border-b border-border last:border-b-0 hover:bg-bg/50">
                <td className="px-4 py-3 font-medium text-text">{student.name}</td>
                <td className="px-4 py-3 text-text-secondary">{student.student_id}</td>
                <td className="px-4 py-3 text-text-secondary">{student.email}</td>
                <td className="px-4 py-3 text-text-secondary">{student.department}</td>
                <td className="px-4 py-3 text-text-secondary">{student.semester}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={student.is_active ? 'active' : 'inactive'} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setConfirmAction({
                      id: student.id,
                      name: student.name,
                      action: student.is_active ? 'disable' : 'enable',
                    })}
                    className={`text-[13px] font-medium ${student.is_active ? 'text-error hover:text-red-700' : 'text-primary hover:text-primary-hover'}`}
                  >
                    {student.is_active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!confirmAction}
        title={`${confirmAction?.action === 'disable' ? 'Disable' : 'Enable'} student?`}
        message={`Are you sure you want to ${confirmAction?.action} ${confirmAction?.name}?`}
        confirmText={confirmAction?.action === 'disable' ? 'Disable' : 'Enable'}
        variant={confirmAction?.action === 'disable' ? 'danger' : 'default'}
        onConfirm={handleToggleStatus}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
