import { ReactNode } from 'react';

export type BadgeVariant =
  | 'hot' | 'warm' | 'cold' | 'reject'
  | 'new' | 'contacted' | 'qualified' | 'disqualified'
  | 'enriched' | 'partial' | 'failed' | 'pending'
  | 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const styles: Record<BadgeVariant, string> = {
  hot:          'bg-rose-100 text-rose-700',
  warm:         'bg-orange-100 text-orange-700',
  cold:         'bg-sky-100 text-sky-700',
  reject:       'bg-slate-100 text-slate-500',
  new:          'bg-indigo-100 text-indigo-700',
  contacted:    'bg-blue-100 text-blue-700',
  qualified:    'bg-emerald-100 text-emerald-700',
  disqualified: 'bg-red-100 text-red-600',
  enriched:     'bg-emerald-100 text-emerald-700',
  partial:      'bg-amber-100 text-amber-700',
  failed:       'bg-red-100 text-red-700',
  pending:      'bg-slate-100 text-slate-500',
  primary:      'bg-indigo-100 text-indigo-700',
  success:      'bg-emerald-100 text-emerald-700',
  warning:      'bg-amber-100 text-amber-700',
  danger:       'bg-red-100 text-red-700',
  neutral:      'bg-slate-100 text-slate-500',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function classificationVariant(c: string | null): BadgeVariant {
  if (!c) return 'neutral';
  const m: Record<string, BadgeVariant> = { Hot: 'hot', Warm: 'warm', Cold: 'cold', Reject: 'reject' };
  return m[c] ?? 'neutral';
}

export function statusVariant(s: string): BadgeVariant {
  const m: Record<string, BadgeVariant> = {
    New: 'new',
    Contacted: 'contacted',
    Qualified: 'qualified',
    Disqualified: 'disqualified',
  };
  return m[s] ?? 'neutral';
}

export function enrichmentVariant(e: string | null): BadgeVariant {
  if (!e) return 'neutral';
  const m: Record<string, BadgeVariant> = {
    Enriched: 'enriched',
    Partial: 'partial',
    Failed: 'failed',
    Pending: 'pending',
  };
  return m[e] ?? 'neutral';
}
