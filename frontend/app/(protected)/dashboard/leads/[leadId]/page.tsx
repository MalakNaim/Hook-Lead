'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DUMMY_LEADS, DUMMY_OUTREACH } from '@/lib/dummy-data';
import { ScoreRing, getScoreColor } from '@/components/ui/ScoreRing';
import { Badge, classificationVariant, enrichmentVariant } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { OutreachMessage } from '@/types';

// ── Types ──────────────────────────────────────────────────────────────────────

type QualStatus = 'qualified' | 'not_qualified' | 'nurturing';

// ── Score Breakdown Bar ────────────────────────────────────────────────────────

function BreakdownBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 45 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="tabular-nums text-xs font-semibold text-slate-700">
          {value}
          <span className="font-normal text-slate-400"> / {max}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Contact Item ───────────────────────────────────────────────────────────────

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {href ? (
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block truncate text-sm text-indigo-600 transition-colors hover:text-indigo-800 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-sm text-slate-800">{value}</p>
        )}
      </div>
    </div>
  );
}

// ── Outreach Timeline ──────────────────────────────────────────────────────────

function OutreachTimeline({
  messages,
  onMarkSent,
  onDiscard,
}: {
  messages: OutreachMessage[];
  onMarkSent: (id: string) => void;
  onDiscard: (id: string) => void;
}) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-600">No outreach yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Click &ldquo;Generate Outreach&rdquo; above to create a personalised email.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3 top-3 bottom-3 w-px bg-slate-200" aria-hidden="true" />

      <div className="space-y-5">
        {messages.map((msg) => {
          const isSent      = msg.status === 'Sent';
          const isDraft     = msg.status === 'Draft';
          const displayDate = new Date(msg.sentAt ?? msg.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          });

          return (
            <div key={msg.id} className="relative flex gap-4">
              {/* Timeline dot */}
              <div
                className={`relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${
                  isSent  ? 'bg-emerald-500' :
                  isDraft ? 'bg-amber-400'   : 'bg-slate-300'
                }`}
                aria-hidden="true"
              >
                {isSent && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isDraft && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                )}
              </div>

              {/* Message card */}
              <div
                className={`flex-1 min-w-0 rounded-xl border p-4 ${
                  isDraft ? 'border-amber-200 bg-amber-50/50' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-snug text-slate-900">{msg.subject}</p>
                  <Badge
                    variant={isSent ? 'enriched' : isDraft ? 'warning' : 'neutral'}
                    className="shrink-0"
                  >
                    {msg.status}
                  </Badge>
                </div>

                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {msg.body.split('\n').filter(Boolean)[1] ?? msg.body.slice(0, 120)}
                </p>

                <p className="mt-2 text-[10px] font-medium text-slate-400">
                  {isSent ? 'Sent' : 'Created'} · {displayDate}
                </p>

                {isDraft && (
                  <div className="mt-3 flex items-center gap-2 border-t border-amber-100 pt-3">
                    <button
                      onClick={() => onMarkSent(msg.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Sent
                    </button>
                    <button
                      onClick={() => onDiscard(msg.id)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      Discard
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Qualification Card ─────────────────────────────────────────────────────────

const QUAL_OPTIONS: {
  id: QualStatus;
  label: string;
  description: string;
  idleClass: string;
  activeClass: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'qualified',
    label: 'Qualified',
    description: 'Strong ICP fit — move to pipeline',
    idleClass: 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50',
    activeClass: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'not_qualified',
    label: 'Not Qualified',
    description: 'Poor fit — remove from pipeline',
    idleClass: 'border-slate-200 hover:border-red-300 hover:bg-red-50/50',
    activeClass: 'border-red-500 bg-red-50 ring-2 ring-red-100',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'nurturing',
    label: 'Nurturing',
    description: 'Not ready yet — keep warm',
    idleClass: 'border-slate-200 hover:border-amber-300 hover:bg-amber-50/50',
    activeClass: 'border-amber-500 bg-amber-50 ring-2 ring-amber-100',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
];

const QUAL_COLORS: Record<QualStatus, string> = {
  qualified:     'text-emerald-700',
  not_qualified: 'text-red-600',
  nurturing:     'text-amber-700',
};

function QualificationCard({
  value,
  onChange,
}: {
  value: QualStatus | null;
  onChange: (s: QualStatus) => void;
}) {
  return (
    <Card>
      <h3 className="mb-1 text-sm font-semibold text-slate-900">Manual Qualification</h3>
      <p className="mb-4 text-xs text-slate-500">Override the automated ICP classification.</p>

      <div className="space-y-2">
        {QUAL_OPTIONS.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`group w-full rounded-xl border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isActive ? opt.activeClass : opt.idleClass
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`shrink-0 transition-colors ${
                    isActive ? QUAL_COLORS[opt.id] : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                >
                  {opt.icon}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold ${
                      isActive ? QUAL_COLORS[opt.id] : 'text-slate-700'
                    }`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[11px] text-slate-400">{opt.description}</p>
                </div>
                {isActive && (
                  <svg
                    className={`ml-auto h-3.5 w-3.5 shrink-0 ${QUAL_COLORS[opt.id]}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {value && (
        <p className={`mt-3 text-center text-xs font-medium ${QUAL_COLORS[value]}`}>
          {value === 'qualified'     && '✓ Marked as Qualified'}
          {value === 'not_qualified' && '✗ Marked as Not Qualified'}
          {value === 'nurturing'     && '○ Added to Nurturing'}
        </p>
      )}
    </Card>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl animate-fade-in"
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

// ── Icons (inline, reused) ─────────────────────────────────────────────────────

function IconEmail() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();

  const lead = DUMMY_LEADS.find((l) => l.id === leadId);

  const [messages, setMessages] = useState<OutreachMessage[]>(
    () => DUMMY_OUTREACH.filter((o) => o.leadId === leadId)
  );
  const [generating, setGenerating] = useState(false);
  const [qualification, setQualification] = useState<QualStatus | null>(() => {
    if (!lead) return null;
    if (lead.status === 'Qualified')    return 'qualified';
    if (lead.status === 'Disqualified') return 'not_qualified';
    return null;
  });
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleGenerateOutreach() {
    if (!lead) return;
    setGenerating(true);
    setTimeout(() => {
      const newMsg: OutreachMessage = {
        id: `gen-${Date.now()}`,
        leadId: lead.id,
        subject: `Reaching out — ${lead.company ?? lead.firstName} × Hook Leads`,
        body: `Hi ${lead.firstName},\n\nI came across your profile and was genuinely impressed by the work you and the team are doing at ${lead.company ?? 'your company'}.\n\nGiven your role as ${lead.jobTitle ?? 'a key decision-maker'}, I thought Hook Leads could be a strong fit — we help teams like yours score and prioritise inbound leads 10× faster using AI, then generate personalised outreach in seconds.\n\nWould you be open to a quick 20-minute call this week?\n\nBest,\nYazan`,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        sentAt: null,
      };
      setMessages((prev) => [newMsg, ...prev]);
      setGenerating(false);
      showToast('Draft outreach message created');
    }, 1200);
  }

  function handleMarkSent(id: string) {
    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: 'Sent', sentAt: new Date().toISOString() } : m)
    );
    showToast('Message marked as sent');
  }

  function handleDiscard(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Draft discarded');
  }

  function handleQualify(s: QualStatus) {
    setQualification(s);
    const labels: Record<QualStatus, string> = {
      qualified:     'Lead marked as Qualified',
      not_qualified: 'Lead marked as Not Qualified',
      nurturing:     'Lead added to Nurturing',
    };
    showToast(labels[s]);
  }

  // ── 404 state ──────────────────────────────────────────────────────────────

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-slate-700">Lead not found</h2>
        <p className="mt-1 text-sm text-slate-500">This lead doesn&apos;t exist or may have been removed.</p>
        <Link href="/dashboard/leads" className="mt-5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const fullName   = `${lead.firstName} ${lead.lastName}`;
  const initials   = `${lead.firstName[0]}${lead.lastName[0]}`;
  const scoreColor = lead.icpScore !== null ? getScoreColor(lead.icpScore) : '#94a3b8';

  return (
    <div className="max-w-5xl space-y-6">

      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Leads
        </Link>
      </nav>

      {/* ── Profile Hero Card ── */}
      <Card padding={false} className="overflow-hidden">
        {/* Score-colour top bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: scoreColor }} />

        <div className="p-6">
          {/* Top row: avatar / name / score ring */}
          <div className="flex flex-wrap items-start gap-5">
            {/* Avatar */}
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
              style={{ backgroundColor: scoreColor }}
              aria-hidden="true"
            >
              {initials}
            </div>

            {/* Name + title + location */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
                {lead.classification && (
                  <Badge variant={classificationVariant(lead.classification)}>
                    {lead.classification}
                  </Badge>
                )}
                {lead.enrichmentStatus && (
                  <Badge variant={enrichmentVariant(lead.enrichmentStatus)}>
                    {lead.enrichmentStatus}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {lead.jobTitle}
                {lead.company && (
                  <>
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="font-medium text-slate-700">{lead.company}</span>
                  </>
                )}
              </p>
              {lead.geography && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {lead.geography}
                </p>
              )}
            </div>

            {/* Score ring */}
            {lead.icpScore !== null ? (
              <div className="shrink-0 flex flex-col items-center gap-1">
                <ScoreRing score={lead.icpScore} size="lg" showLabel />
              </div>
            ) : (
              <div className="shrink-0 flex flex-col items-center justify-center gap-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-200">
                  <span className="text-xs font-medium text-slate-400">No score</span>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Pending</span>
              </div>
            )}
          </div>

          {/* Contact grid */}
          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <ContactItem
              icon={<IconEmail />}
              label="Email"
              value={lead.email}
              href={`mailto:${lead.email}`}
            />
            {lead.phone && (
              <ContactItem
                icon={<IconPhone />}
                label="Phone"
                value={lead.phone}
                href={`tel:${lead.phone}`}
              />
            )}
            {lead.whatsapp && (
              <ContactItem
                icon={<IconWhatsApp />}
                label="WhatsApp"
                value={lead.whatsapp}
                href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
              />
            )}
            {lead.linkedInUrl && (
              <ContactItem
                icon={<IconLinkedIn />}
                label="LinkedIn"
                value="View Profile"
                href={lead.linkedInUrl}
              />
            )}
            {lead.companyWebsite && (
              <ContactItem
                icon={<IconGlobe />}
                label="Company Website"
                value={lead.companyWebsite.replace(/^https?:\/\//, '')}
                href={lead.companyWebsite}
              />
            )}
          </div>

          {/* Action bar */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={handleGenerateOutreach}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {generating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Outreach
                </>
              )}
            </button>

            {lead.linkedInUrl && (
              <a
                href={lead.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <IconLinkedIn />
                LinkedIn
              </a>
            )}

            {lead.source && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {lead.source}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* ── Body — two-column grid ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* ── Main column (2/3) ── */}
        <div className="space-y-4 md:col-span-2">

          {/* Score Breakdown */}
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">ICP Score Breakdown</h2>
                <p className="mt-0.5 text-xs text-slate-500">How this lead matches your active ICP</p>
              </div>
              {lead.icpScore !== null && (
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums" style={{ color: scoreColor }}>
                    {lead.icpScore}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    / 100
                  </p>
                </div>
              )}
            </div>

            {lead.scoreBreakdown ? (
              <div className="space-y-4">
                <BreakdownBar label="Job Title Match"     value={lead.scoreBreakdown.jobTitleMatch}      max={30} />
                <BreakdownBar label="Industry Match"      value={lead.scoreBreakdown.industryMatch}      max={25} />
                <BreakdownBar label="Company Size Match"  value={lead.scoreBreakdown.companySizeMatch}   max={15} />
                <BreakdownBar label="Pain Point Match"    value={lead.scoreBreakdown.painMatch}          max={20} />
                <BreakdownBar label="Activity / Signals"  value={lead.scoreBreakdown.activitySignals}    max={10} />

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500">Total Score</span>
                  <span className="text-base font-bold tabular-nums" style={{ color: scoreColor }}>
                    {lead.scoreBreakdown.total} / 100
                  </span>
                </div>

                {/* Score legend */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: 'High Fit',   range: '70–100', cls: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Medium Fit', range: '45–69',  cls: 'bg-amber-50 text-amber-700'   },
                    { label: 'Low Fit',    range: '0–44',   cls: 'bg-red-50 text-red-600'        },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg px-2.5 py-2 text-center ${item.cls}`}>
                      <p className="text-[11px] font-semibold">{item.label}</p>
                      <p className="text-[10px] opacity-70">{item.range}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-600">Not yet scored</p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">
                  Scoring runs automatically once enrichment completes.
                </p>
              </div>
            )}
          </Card>

          {/* Outreach Timeline */}
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Outreach History</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {messages.length} message{messages.length !== 1 ? 's' : ''} on record
                </p>
              </div>
              {messages.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 tabular-nums">
                  {messages.filter((m) => m.status === 'Sent').length} sent ·{' '}
                  {messages.filter((m) => m.status === 'Draft').length} draft
                </span>
              )}
            </div>
            <OutreachTimeline
              messages={messages}
              onMarkSent={handleMarkSent}
              onDiscard={handleDiscard}
            />
          </Card>
        </div>

        {/* ── Sidebar (1/3) ── */}
        <div className="space-y-4">

          {/* Manual Qualification */}
          <QualificationCard value={qualification} onChange={handleQualify} />

          {/* Company Info */}
          {(lead.industry || lead.companySize || lead.revenueRange) && (
            <Card>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Company
              </h3>
              <div className="space-y-3">
                {lead.industry && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Industry</p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.industry}</p>
                  </div>
                )}
                {lead.companySize && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Company Size</p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.companySize}</p>
                  </div>
                )}
                {lead.revenueRange && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Revenue Range</p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.revenueRange}</p>
                  </div>
                )}
                {lead.geography && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Location</p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.geography}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Notes */}
          {lead.notes && (
            <Card>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Notes</h3>
              <div className="rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {lead.notes}
                </p>
              </div>
            </Card>
          )}

          {/* Import meta */}
          <Card>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Lead Info
            </h3>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</p>
                <p className="mt-0.5 text-sm font-medium text-slate-700">{lead.status}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Source</p>
                <p className="mt-0.5 text-sm text-slate-700">{lead.source}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Imported</p>
                <p className="mt-0.5 text-sm text-slate-700">
                  {new Date(lead.importedAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
