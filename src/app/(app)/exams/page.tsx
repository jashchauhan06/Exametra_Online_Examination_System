'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, Plus, FileText, Filter } from 'lucide-react';
import { fetchExams, fetchSubjects } from '@/lib/data/supabase-service';

const tabs = [
  { label: 'All Examinations', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Active / Live', value: 'live' },
  { label: 'Completed', value: 'completed' },
] as const;

export default function ExamsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const [baseExams, setBaseExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (!user) return;
      
      try {
        const [examsData, subjectsData] = await Promise.all([
          fetchExams(user.role === 'faculty' ? user.id : undefined),
          fetchSubjects()
        ]);
        
        // For students, ideally we filter by enrolled_subjects, but for now we'll just show all live/upcoming
        // that are assigned or just all exams.
        if (user.role === 'student') {
          // A rudimentary filter for students, normally done via SQL JOIN or RLS
          setBaseExams(examsData.filter(e => e.status !== 'draft'));
        } else {
          setBaseExams(examsData);
        }
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Failed to load exams', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const filteredExams = useMemo(() => {
    let exs = [...baseExams];
    if (activeTab !== 'all') {
      exs = exs.filter(e => e.status === activeTab);
    }
    if (subjectFilter) {
      exs = exs.filter(e => e.subject_id === subjectFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      exs = exs.filter(e => e.title.toLowerCase().includes(s));
    }
    return exs;
  }, [baseExams, activeTab, subjectFilter, search]);

  const isFaculty = user?.role === 'faculty' || user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-page-enter">
      <PageHeader
        title="Examinations"
        subtitle="View exam schedules, live assessments, and past examination papers."
        actions={isFaculty ? (
          <Link href="/exams/create" className="btn-solid-primary">
            <Plus size={15} /> Create Exam
          </Link>
        ) : undefined}
      />

      {/* ── Tabs and Filters Row ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Modern Segmented Control */}
        <div className="inline-flex p-1 bg-[#F4F4F5] rounded-lg">
          {tabs.map(tab => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="relative px-4 py-1.5 text-[13px] font-medium rounded-md transition-all duration-200"
                style={{
                  color: isActive ? '#18181B' : '#71717A',
                }}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 bg-white rounded-md shadow-sm"
                    style={{ border: '1px solid rgba(0,0,0,0.04)', zIndex: 0 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search examinations..."
              className="input-enterprise w-full !pl-9"
            />
          </div>
          <div className="relative w-full sm:w-48">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="input-enterprise w-full !pl-9 appearance-none bg-no-repeat"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A1A1AA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
              }}
            >
              <option value="">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-500 mb-4"></i>
            <p className="text-sm font-medium text-gray-500 animate-pulse">Loading exams...</p>
          </div>
        ) : filteredExams.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No examinations found"
          description={search || subjectFilter ? "Try adjusting your search criteria or filters." : "No examination entries available."}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredExams.map((exam, i) => {
            const subject = subjects.find(s => s.id === exam.subject_id);
            const examDate = new Date(exam.date + 'T' + (exam.start_time || '00:00'));
            return (
              <div
                key={exam.id}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 stagger-${(i % 10) + 1} animate-fade-up rounded-lg transition-all`}
                style={{ 
                  background: '#FAFAFA',
                  border: '1px solid rgba(0,0,0,0.03)',
                  borderLeft: `4px solid ${
                    exam.status === 'completed' ? '#10B981' :
                    exam.status === 'live' ? '#EF4444' :
                    exam.status === 'upcoming' ? '#3B82F6' :
                    exam.status === 'missed' ? '#F59E0B' : '#71717A'
                  }`
                }}
              >
                <div className="min-w-0 flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[15px] font-semibold" style={{ color: '#111' }}>{exam.title}</span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#F0F0F0', color: '#555' }}>
                      {subject?.code || '—'}
                    </span>
                    <StatusBadge variant={exam.status} />
                  </div>
                  <div className="text-[13px] flex items-center gap-3 mt-1" style={{ color: '#777' }}>
                    <span>{exam.total_questions} questions</span>
                    <span>·</span>
                    <span>{exam.total_marks} marks</span>
                    <span>·</span>
                    <span>{exam.duration} mins</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 sm:gap-8 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[14px] font-semibold" style={{ color: '#111' }}>
                      {examDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[13px]" style={{ color: '#777' }}>
                      {examDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                  
                  <Link
                    href={`/exams/${exam.id}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-200 group-hover:translate-x-1"
                    style={{ background: '#111', color: '#FFF' }}
                    title={exam.status === 'live' && user?.role === 'student' ? 'Start Exam' : 'View Details'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
