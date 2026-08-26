import React from 'react';

type StatusVariant = 'upcoming' | 'live' | 'completed' | 'passed' | 'failed' | 'missed';

export function StatusBadge({ variant }: { variant: StatusVariant | string }) {
  const styles: Record<string, { text: string; dot: string; label: string }> = {
    upcoming: { text: '#3B82F6', dot: '#3B82F6', label: 'Upcoming' },
    live: { text: '#EF4444', dot: '#EF4444', label: 'Live' },
    completed: { text: '#10B981', dot: '#10B981', label: 'Completed' },
    passed: { text: '#10B981', dot: '#10B981', label: 'Passed' },
    failed: { text: '#EF4444', dot: '#EF4444', label: 'Failed' },
    missed: { text: '#F59E0B', dot: '#F59E0B', label: 'Not Given' },
    active: { text: '#EF4444', dot: '#EF4444', label: 'Active' },
    inactive: { text: '#71717A', dot: '#71717A', label: 'Disabled' },
  };

  const config = styles[variant] || styles.upcoming;

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium w-max"
      style={{ color: config.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.dot }} />
      {config.label}
    </span>
  );
}

