import React from 'react';
import { FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon = FileText, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon size={20} style={{ color: '#bbb' }} className="mb-3" />
      <h3 className="text-[13px] font-medium" style={{ color: '#666' }}>
        {title}
      </h3>
      <p className="text-[12px] mt-1 max-w-sm" style={{ color: '#999' }}>
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

