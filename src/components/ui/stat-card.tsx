import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  caption?: string;
  accent?: string;
}

export function StatCard({ label, value, change, trend, caption, accent }: StatCardProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-[13px] font-medium mb-1.5" style={{ color: '#71717A' }}>
        {label}
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[36px] font-semibold tracking-tighter tabular-nums leading-none" style={{ color: accent || '#18181B' }}>
          {value}
        </span>
        {change && (
          <span
            className="text-[13px] font-medium tabular-nums"
            style={{
              color: trend === 'up' ? '#0D9373' : trend === 'down' ? '#DC2626' : '#71717A',
            }}
          >
            {change}
          </span>
        )}
      </div>
      {caption && (
        <div className="mt-1.5 text-[13px]" style={{ color: '#A1A1AA' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

export function MetricStrip({ children, cols }: { children: React.ReactNode; cols?: number }) {
  return (
    <div
      className="flex flex-wrap gap-y-8"
      style={{
        display: 'flex',
        gap: '0',
      }}
    >
      {React.Children.map(children, (child, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <div
              className="hidden sm:block self-stretch mx-8"
              style={{
                width: '1px',
                background: 'rgba(0, 0, 0, 0.05)',
              }}
            />
          )}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

export function MetricItem({ label, value, icon, change, trend, caption, accent }: StatCardProps) {
  return (
    <StatCard label={label} value={value} change={change} trend={trend} caption={caption} accent={accent} />
  );
}

