import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight" style={{ color: '#18181B' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] mt-1" style={{ color: '#71717A' }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
