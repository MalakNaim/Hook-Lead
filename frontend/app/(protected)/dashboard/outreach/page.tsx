'use client';

import { useState, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type SequenceStatus = 'Draft' | 'Active' | 'Paused';
type StatusFilter   = SequenceStatus | 'All';

interface EmailStep {
  day: number;
  subject: string;
  body: string;
}

interface OutreachSequence {
  id: string;
  name: string;
  targetICP: string;
  steps: EmailStep[];
  status: SequenceStatus;
  replyRate: number;
  leadsEnrolled: number;
  updatedAt: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const INITIAL_SEQUENCES: OutreachSequence[] = [
  {
    id: 'seq-1',
    name: 'Hot Leads — SaaS Founders',
    targetICP: 'Primary ICP',
    status: 'Active',
    replyRate: 34,
    leadsEnrolled: 12,
    updatedAt: '2025-04-18T09:00:00Z',
    steps: [
      {
        day: 1,
        subject: "Quick question about {{company}}'s lead pipeline",
        body: `Hi {{first_name}},\n\nI noticed {{company}} is scaling fast — congrats on the momentum.\n\nHook Leads helps SaaS founders like you score and prioritise inbound leads automatically, then generate personalised outreach in seconds. Most teams cut their qualification time by 60% in the first month.\n\nWould a quick 15-minute call make sense this week?\n\nBest,\n{{sender_name}}`,
      },
      {
        day: 4,
        subject: "Re: Quick question about {{company}}'s lead pipeline",
        body: `Hi {{first_name}},\n\nJust following up — I know your inbox is busy.\n\nOne thing I forgot to mention: Hook Leads integrates with LinkedIn and your CRM in minutes, so there's zero manual setup.\n\nHappy to send a 2-minute demo video if that's easier than a call.\n\nBest,\n{{sender_name}}`,
      },
      {
        day: 8,
        subject: 'Last note from Hook Leads',
        body: `Hi {{first_name}},\n\nI'll keep this short.\n\nIf AI-powered lead scoring isn't a priority right now, no worries at all. But if it ever becomes relevant, I'd love to show you what we've built.\n\nWishing {{company}} continued success.\n\n{{sender_name}}`,
      },
    ],
  },
  {
    id: 'seq-2',
    name: 'Enterprise Decision Makers',
    targetICP: 'Enterprise ICP',
    status: 'Active',
    replyRate: 22,
    leadsEnrolled: 8,
    updatedAt: '2025-04-15T14:00:00Z',
    steps: [
      {
        day: 1,
        subject: "Saw {{company}}'s expansion — thought of you",
        body: `Hi {{first_name}},\n\nI came across {{company}}'s recent growth announcement and immediately thought of our work with similar enterprise teams.\n\nHook Leads helps Directors and VPs qualify inbound leads 10× faster using AI scoring — without adding headcount.\n\nWorth a brief conversation?\n\nBest,\n{{sender_name}}`,
      },
      {
        day: 3,
        subject: 'One thing most enterprise sales teams miss',
        body: `Hi {{first_name}},\n\nMost enterprise teams tell us the same thing: their lead scoring is either manual or unreliable, which means reps spend too much time on the wrong accounts.\n\nHook Leads fixes that with an AI model trained on your ICP. It scores every lead on 5 dimensions and surfaces the ones worth calling.\n\nOpen to a 20-minute walkthrough?\n\n{{sender_name}}`,
      },
      {
        day: 7,
        subject: 'Case study: 3× pipeline quality in 6 weeks',
        body: `Hi {{first_name}},\n\nWanted to share a quick story — a Director of Sales at a company similar to {{company}} used Hook Leads for 6 weeks and tripled their pipeline quality score while keeping the same lead volume.\n\nHappy to walk you through exactly how they did it.\n\nJust say the word.\n\n{{sender_name}}`,
      },
      {
        day: 14,
        subject: 'Re: {{company}} + Hook Leads',
        body: `Hi {{first_name}},\n\nI want to be respectful of your time, so this will be my penultimate note.\n\nWe're currently running a limited enterprise pilot with 3 spots remaining this quarter. It includes full onboarding, a dedicated success manager, and a 60-day performance guarantee.\n\nWould {{company}} be a fit?\n\n{{sender_name}}`,
      },
      {
        day: 21,
        subject: 'Closing the loop — Hook Leads',
        body: `Hi {{first_name}},\n\nI'll stop reaching out after this — I promise.\n\nIf AI lead scoring ever becomes a priority at {{company}}, I'd genuinely love to connect.\n\nUntil then, I wish you and the team all the best.\n\n{{sender_name}}`,
      },
    ],
  },
  {
    id: 'seq-3',
    name: 'Warm Leads — Re-engagement',
    targetICP: 'SMB Growth ICP',
    status: 'Paused',
    replyRate: 18,
    leadsEnrolled: 23,
    updatedAt: '2025-04-10T10:30:00Z',
    steps: [
      {
        day: 1,
        subject: 'Checking back in — {{company}}',
        body: `Hi {{first_name}},\n\nWe connected a while back about Hook Leads — I wanted to check in and see how things are going at {{company}}.\n\nA lot has changed since then: we've shipped AI email generation, LinkedIn enrichment, and a new ICP scoring engine.\n\nWould a fresh look make sense?\n\n{{sender_name}}`,
      },
      {
        day: 5,
        subject: 'New: AI-generated outreach is now live',
        body: `Hi {{first_name}},\n\nJust wanted to share that we recently launched AI-generated outreach directly inside Hook Leads — you can go from a scored lead to a personalised email in under 10 seconds.\n\nGiven your role at {{company}}, I thought you'd find this relevant.\n\nHappy to show you a live demo.\n\n{{sender_name}}`,
      },
      {
        day: 10,
        subject: 'Last one — I promise',
        body: `Hi {{first_name}},\n\nFinal note from me.\n\nIf now isn't the right time, I completely understand. Growth-stage companies have a lot on their plate.\n\nFeel free to reach out whenever the timing makes more sense.\n\nAll the best to you and the {{company}} team.\n\n{{sender_name}}`,
      },
      {
        day: 30,
        subject: 'Long-shot: is now a better time?',
        body: `Hi {{first_name}},\n\nIt's been a month since I last reached out. Taking a long-shot and checking in one last time.\n\nWe just crossed 50 customers and have a few case studies that might resonate with where {{company}} is headed.\n\nIf you have 15 minutes, I'd love to reconnect.\n\n{{sender_name}}`,
      },
    ],
  },
  {
    id: 'seq-4',
    name: 'Product-Led Growth Teams',
    targetICP: 'Primary ICP',
    status: 'Draft',
    replyRate: 0,
    leadsEnrolled: 0,
    updatedAt: '2025-04-22T08:00:00Z',
    steps: [
      {
        day: 1,
        subject: 'How {{company}} could double its lead conversion rate',
        body: `Hi {{first_name}},\n\nProduct-led teams often have the opposite problem of traditional sales: lots of signups, but no easy way to tell which ones are worth pursuing.\n\nHook Leads solves that by scoring every lead against your ICP automatically — so your sales team knows exactly who to call and when.\n\nWould a quick chat make sense?\n\n{{sender_name}}`,
      },
      {
        day: 4,
        subject: 'Re: {{company}} lead conversion',
        body: `Hi {{first_name}},\n\nFollowing up on my last message.\n\nQuick question: how much time does your team spend manually qualifying leads from your free tier? Most teams tell us it's 8–12 hours per week — and we can automate most of that.\n\n{{sender_name}}`,
      },
      {
        day: 9,
        subject: 'One last thought',
        body: `Hi {{first_name}},\n\nI'll leave you with one thought: the best-converting PLG teams we've worked with all share one thing — they know exactly which leads to prioritise before they ever pick up the phone.\n\nThat's what Hook Leads gives you.\n\nTake care,\n{{sender_name}}`,
      },
    ],
  },
  {
    id: 'seq-5',
    name: 'Cold Outreach — FinTech',
    targetICP: 'Enterprise ICP',
    status: 'Draft',
    replyRate: 0,
    leadsEnrolled: 0,
    updatedAt: '2025-04-24T16:00:00Z',
    steps: [
      {
        day: 1,
        subject: 'Compliance-friendly lead scoring for FinTech teams',
        body: `Hi {{first_name}},\n\nFinTech teams face a unique challenge: your ideal customers are often hard to identify from the outside, and compliance constraints make outbound tricky.\n\nHook Leads uses a configurable ICP model that accounts for company size, geography, and regulatory environment to surface the accounts most likely to convert.\n\nWorth exploring?\n\n{{sender_name}}`,
      },
      {
        day: 6,
        subject: 'Quick follow-up — FinTech + Hook Leads',
        body: `Hi {{first_name}},\n\nJust a quick follow-up on my last note.\n\nI'd love to show you how we've helped FinTech teams improve lead quality while staying within outbound compliance guidelines.\n\n15 minutes — your schedule.\n\n{{sender_name}}`,
      },
    ],
  },
];

const ICP_OPTIONS = ['Primary ICP', 'Enterprise ICP', 'SMB Growth ICP'];

const STATUS_FILTERS: StatusFilter[] = ['All', 'Active', 'Paused', 'Draft'];

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function genSteps(n: number): EmailStep[] {
  const days = [1, 4, 8, 14, 21, 28, 35, 42, 49, 56];
  return Array.from({ length: n }, (_, i) => ({
    day: days[i] ?? (i * 7 + 1),
    subject: `Step ${i + 1} — {{company}}`,
    body: `Hi {{first_name}},\n\nThis is step ${i + 1} of your sequence. Customise this message to match your outreach strategy.\n\nBest,\n{{sender_name}}`,
  }));
}

// ── Status Badge ───────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<SequenceStatus, { badge: string; dot: string; pulse: boolean }> = {
  Active: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', pulse: true  },
  Paused: { badge: 'bg-amber-100  text-amber-700',   dot: 'bg-amber-500',   pulse: false },
  Draft:  { badge: 'bg-slate-100  text-slate-500',   dot: 'bg-slate-400',   pulse: false },
};

function StatusBadge({ status }: { status: SequenceStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
      <span className="relative flex h-2 w-2">
        {s.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${s.dot}`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
      </span>
      {status}
    </span>
  );
}

// ── Rule Reminder Banner ───────────────────────────────────────────────────────

function RuleBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
        <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">Outreach rules</p>
        <ul className="mt-1 space-y-0.5 text-xs text-amber-700">
          <li className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Never contact leads classified as <strong className="font-semibold">Reject</strong>.
          </li>
          <li className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Enrol only <strong className="font-semibold">Hot</strong> and <strong className="font-semibold">Warm</strong> leads into active sequences.
          </li>
          <li className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Cold leads may receive a single introduction — no follow-up sequences.
          </li>
        </ul>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss outreach rules"
        className="shrink-0 rounded-lg p-1 text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-slate-900 tabular-nums">{value}</p>
        <p className="text-xs text-slate-500 truncate">{label}</p>
        {sub && <p className="text-[10px] text-slate-400 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ── Sequence Card ──────────────────────────────────────────────────────────────

function SequenceCard({
  seq,
  onPreview,
  onToggle,
  onDelete,
}: {
  seq: OutreachSequence;
  onPreview: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const canToggle  = seq.status === 'Active' || seq.status === 'Paused';
  const isActive   = seq.status === 'Active';

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Top accent bar */}
      <div
        className={`h-0.5 w-full ${
          isActive ? 'bg-emerald-500' : seq.status === 'Paused' ? 'bg-amber-400' : 'bg-slate-300'
        }`}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">{seq.name}</h3>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" strokeLinecap="round" />
                <circle cx="12" cy="12" r="4" strokeLinecap="round" />
              </svg>
              {seq.targetICP}
            </span>
          </div>
          <StatusBadge status={seq.status} />
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-center text-xs">
          <div>
            <p className="font-bold text-slate-800 tabular-nums">{seq.steps.length}</p>
            <p className="text-slate-400">Steps</p>
          </div>
          <div>
            <p className="font-bold text-slate-800 tabular-nums">{seq.leadsEnrolled}</p>
            <p className="text-slate-400">Enrolled</p>
          </div>
          <div>
            <p className={`font-bold tabular-nums ${seq.replyRate > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {seq.replyRate > 0 ? `${seq.replyRate}%` : '—'}
            </p>
            <p className="text-slate-400">Reply rate</p>
          </div>
        </div>

        {/* Reply rate bar (only when active/paused and has data) */}
        {seq.replyRate > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Reply Rate</span>
              <span className="text-[10px] font-semibold text-emerald-600 tabular-nums">{seq.replyRate}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${seq.replyRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <p className="text-[11px] text-slate-400">
            Updated {fmtDate(seq.updatedAt)}
          </p>
          <div className="flex items-center gap-1">
            {/* Preview */}
            <button
              onClick={onPreview}
              title="Preview emails"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Pause / Resume */}
            {canToggle && (
              <button
                onClick={onToggle}
                title={isActive ? 'Pause sequence' : 'Resume sequence'}
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? 'text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                    : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                {isActive ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete sequence"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/95 p-6 text-center backdrop-blur-[2px]">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-800">Delete &ldquo;{seq.name}&rdquo;?</p>
          <p className="mt-1 text-xs text-slate-500">This cannot be undone.</p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => { onDelete(); setConfirmDelete(false); }}
              className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
            >
              Yes, delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Email Preview Panel ────────────────────────────────────────────────────────

function EmailPreviewPanel({
  seq,
  isOpen,
  onClose,
}: {
  seq: OutreachSequence | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedStep, setExpandedStep] = useState<number>(0);

  if (!seq) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over */}
      <aside
        aria-label="Email preview panel"
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[560px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-slate-900">{seq.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StatusBadge status={seq.status} />
              <span className="text-xs text-slate-400">
                {seq.steps.length} step{seq.steps.length !== 1 ? 's' : ''}
              </span>
              {seq.leadsEnrolled > 0 && (
                <span className="text-xs text-slate-400">· {seq.leadsEnrolled} enrolled</span>
              )}
              {seq.replyRate > 0 && (
                <span className="text-xs font-semibold text-emerald-600">· {seq.replyRate}% reply rate</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Target ICP bar */}
        <div className="shrink-0 border-b border-slate-100 bg-indigo-50/60 px-6 py-2.5">
          <div className="flex items-center gap-2 text-xs text-indigo-700">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="9" strokeLinecap="round" />
              <circle cx="12" cy="12" r="4" strokeLinecap="round" />
            </svg>
            <span className="font-semibold">Target ICP:</span>
            <span>{seq.targetICP}</span>
          </div>
        </div>

        {/* Steps timeline */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Sequence · {seq.steps.length} steps
            </p>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3.5 top-4 bottom-4 w-px bg-slate-200" aria-hidden="true" />

              <div className="space-y-3">
                {seq.steps.map((step, idx) => {
                  const isExpanded = expandedStep === idx;
                  return (
                    <div key={idx} className="relative flex gap-4">
                      {/* Step dot */}
                      <div
                        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ring-4 ring-white ${
                          isExpanded ? 'bg-indigo-600' : 'bg-slate-400'
                        }`}
                        aria-hidden="true"
                      >
                        {idx + 1}
                      </div>

                      {/* Step content */}
                      <div className="mb-2 flex-1 min-w-0">
                        <button
                          onClick={() => setExpandedStep(isExpanded ? -1 : idx)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/30"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 mb-0.5">
                                Day {step.day}
                              </p>
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {step.subject}
                              </p>
                            </div>
                            <svg
                              className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>

                          {isExpanded && (
                            <div className="mt-3 border-t border-slate-100 pt-3">
                              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-600">
                                {step.body}
                              </pre>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {['{{first_name}}', '{{company}}', '{{sender_name}}'].map((token) => (
                                  step.body.includes(token) && (
                                    <span key={token} className="rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700">
                                      {token}
                                    </span>
                                  )
                                ))}
                              </div>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              Close
            </button>
            <button
              className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-400 opacity-60"
              title="Coming soon"
              disabled
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Sequence
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Create Sequence Panel ──────────────────────────────────────────────────────

function CreateSequencePanel({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (seq: OutreachSequence) => void;
}) {
  const [name, setName]         = useState('');
  const [icp, setIcp]           = useState(ICP_OPTIONS[0]);
  const [stepCount, setStepCount] = useState(3);
  const [error, setError]       = useState('');
  const [saving, setSaving]     = useState(false);

  function reset() {
    setName('');
    setIcp(ICP_OPTIONS[0]);
    setStepCount(3);
    setError('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!name.trim()) { setError('Sequence name is required'); return; }
    setSaving(true);
    setTimeout(() => {
      onSave({
        id: `seq-${Date.now()}`,
        name: name.trim(),
        targetICP: icp,
        steps: genSteps(stepCount),
        status: 'Draft',
        replyRate: 0,
        leadsEnrolled: 0,
        updatedAt: new Date().toISOString(),
      });
      setSaving(false);
      reset();
    }, 600);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <aside
        aria-label="Create sequence panel"
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[480px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">New Sequence</h2>
            <p className="mt-0.5 text-xs text-slate-500">Create a new email outreach sequence</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="seq-name">
                Sequence Name <span className="text-red-500">*</span>
              </label>
              <input
                id="seq-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="e.g. Hot Leads — Q3 Campaign"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  error ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400'
                }`}
              />
              {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>

            {/* Target ICP */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="seq-icp">
                Target ICP
              </label>
              <div className="relative">
                <select
                  id="seq-icp"
                  value={icp}
                  onChange={(e) => setIcp(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 text-sm text-slate-900 transition-colors hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ICP_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">Leads must match this ICP to be enrolled</p>
            </div>

            {/* Step count */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="seq-steps">
                Number of Steps
              </label>
              <input
                id="seq-steps"
                type="number"
                min={1}
                max={10}
                value={stepCount}
                onChange={(e) => setStepCount(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-colors hover:border-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1.5 text-xs text-slate-500">Each step is a separate email. Steps are spaced automatically.</p>
            </div>

            {/* Preview of step timeline */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Step schedule preview
              </p>
              <div className="space-y-1.5">
                {genSteps(stepCount).map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                      {i + 1}
                    </span>
                    <span className="font-medium">Day {step.day}</span>
                    <span className="text-slate-400">— placeholder email</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rule reminder inline */}
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              <svg className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>Only <strong>Hot</strong> and <strong>Warm</strong> leads will be enrolled in this sequence. Reject leads are always excluded.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={handleClose} className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating…
                </>
              ) : (
                'Create Sequence'
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl"
      role="status"
      aria-live="polite"
    >
      <svg className="h-4 w-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function OutreachPage() {
  const [sequences, setSequences]   = useState<OutreachSequence[]>(INITIAL_SEQUENCES);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [search, setSearch]         = useState('');
  const [previewSeq, setPreviewSeq] = useState<OutreachSequence | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [rulesDismissed, setRulesDismissed] = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function openPreview(seq: OutreachSequence) {
    setPreviewSeq(seq);
    setPreviewOpen(true);
  }

  function handleToggle(id: string) {
    setSequences((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const next: SequenceStatus = s.status === 'Active' ? 'Paused' : 'Active';
        showToast(`"${s.name}" ${next === 'Active' ? 'resumed' : 'paused'}`);
        return { ...s, status: next, updatedAt: new Date().toISOString() };
      })
    );
  }

  function handleDelete(id: string) {
    const name = sequences.find((s) => s.id === id)?.name;
    setSequences((prev) => prev.filter((s) => s.id !== id));
    showToast(`"${name}" deleted`);
  }

  function handleCreate(seq: OutreachSequence) {
    setSequences((prev) => [seq, ...prev]);
    setCreateOpen(false);
    showToast(`"${seq.name}" created as Draft`);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sequences.filter((s) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.targetICP.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [sequences, statusFilter, search]);

  function filterCount(f: StatusFilter) {
    if (f === 'All') return sequences.length;
    return sequences.filter((s) => s.status === f).length;
  }

  // Derived stats
  const activeCount   = sequences.filter((s) => s.status === 'Active').length;
  const draftCount    = sequences.filter((s) => s.status === 'Draft').length;
  const totalEnrolled = sequences.reduce((sum, s) => sum + s.leadsEnrolled, 0);
  const activeSeqs    = sequences.filter((s) => s.status === 'Active' && s.replyRate > 0);
  const avgReply      = activeSeqs.length
    ? Math.round(activeSeqs.reduce((sum, s) => sum + s.replyRate, 0) / activeSeqs.length)
    : 0;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Outreach Sequences</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Build and manage automated email sequences for your ICP leads.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Sequence
        </button>
      </div>

      {/* ── Rule Reminder ── */}
      {!rulesDismissed && (
        <RuleBanner onDismiss={() => setRulesDismissed(true)} />
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Active Sequences"
          value={activeCount}
          accent="bg-emerald-50 text-emerald-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          label="Leads Enrolled"
          value={totalEnrolled}
          accent="bg-indigo-50 text-indigo-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Avg Reply Rate"
          value={avgReply > 0 ? `${avgReply}%` : '—'}
          sub="Active sequences only"
          accent="bg-sky-50 text-sky-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Drafts Pending"
          value={draftCount}
          accent="bg-amber-50 text-amber-600"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        />
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status tabs */}
        <div className="flex overflow-hidden rounded-lg border border-slate-300 bg-white" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                i > 0 ? 'border-l border-slate-300' : ''
              } ${
                statusFilter === f
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                  statusFilter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {filterCount(f)}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sequences…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Sequence grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <svg className="h-7 w-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">
            {search ? `No sequences match "${search}"` : 'No sequences in this view'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {search || statusFilter !== 'All'
              ? 'Try adjusting your filters.'
              : 'Create your first sequence to start automating outreach.'}
          </p>
          {(search || statusFilter !== 'All') ? (
            <button
              onClick={() => { setSearch(''); setStatusFilter('All'); }}
              className="mt-4 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Sequence
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((seq) => (
            <SequenceCard
              key={seq.id}
              seq={seq}
              onPreview={() => openPreview(seq)}
              onToggle={() => handleToggle(seq.id)}
              onDelete={() => handleDelete(seq.id)}
            />
          ))}
        </div>
      )}

      {/* ── Footer count ── */}
      {filtered.length > 0 && (
        <p className="text-xs text-slate-400">
          Showing{' '}
          <span className="font-semibold text-slate-600">{filtered.length}</span>{' '}
          of{' '}
          <span className="font-semibold text-slate-600">{sequences.length}</span>{' '}
          sequence{sequences.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* ── Email Preview Panel ── */}
      <EmailPreviewPanel
        seq={previewSeq}
        isOpen={previewOpen}
        onClose={() => { setPreviewOpen(false); }}
      />

      {/* ── Create Sequence Panel ── */}
      <CreateSequencePanel
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
      />

      {/* ── Toast ── */}
      {toast && <Toast message={toast} />}
    </div>
  );
}
