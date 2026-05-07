'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DUMMY_LEADS, DUMMY_OUTREACH } from '@/lib/dummy-data';
import { getLeadById, updateLeadStatus, addLeadNote } from '@/services/leadsService';
import { ScoreRing, getScoreColor } from '@/components/ui/ScoreRing';
import { Badge, classificationVariant, enrichmentVariant, statusVariant } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { Lead, LeadStatus, OutreachMessage } from '@/types';
import { useLocale } from '@/lib/i18n';

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
  const { t } = useLocale();

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-600">{t('pages.leadDetail.noOutreach')}</p>
        <p className="mt-1 text-xs text-slate-400">{t('pages.leadDetail.noOutreachDesc')}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-3 bottom-3 w-px bg-slate-200" aria-hidden="true" />
      <div className="space-y-5">
        {messages.map((msg) => {
          const isSent  = msg.status === 'Sent';
          const isDraft = msg.status === 'Draft';
          const displayDate = new Date(msg.sentAt ?? msg.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          });

          return (
            <div key={msg.id} className="relative flex gap-4">
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
                  {isSent ? t('pages.leadDetail.sent') : t('pages.leadDetail.created')} · {displayDate}
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
                      {t('pages.leadDetail.markAsSent')}
                    </button>
                    <button
                      onClick={() => onDiscard(msg.id)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                    >
                      {t('pages.leadDetail.discard')}
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

// ── Status Card ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: {
  id: 'New' | 'Qualified' | 'Disqualified' | 'Unsubscribed';
  idleClass: string;
  activeClass: string;
  dotClass: string;
  labelKey: string;
}[] = [
  {
    id: 'New',
    idleClass: 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50',
    activeClass: 'border-blue-500 bg-blue-50 ring-2 ring-blue-100',
    dotClass: 'bg-blue-500',
    labelKey: 'statusNew',
  },
  {
    id: 'Qualified',
    idleClass: 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50',
    activeClass: 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100',
    dotClass: 'bg-emerald-500',
    labelKey: 'statusQualified',
  },
  {
    id: 'Disqualified',
    idleClass: 'border-slate-200 hover:border-red-300 hover:bg-red-50/50',
    activeClass: 'border-red-500 bg-red-50 ring-2 ring-red-100',
    dotClass: 'bg-red-500',
    labelKey: 'statusDisqualified',
  },
  {
    id: 'Unsubscribed',
    idleClass: 'border-slate-200 hover:border-slate-400 hover:bg-slate-50',
    activeClass: 'border-slate-500 bg-slate-50 ring-2 ring-slate-200',
    dotClass: 'bg-slate-400',
    labelKey: 'statusUnsubscribed',
  },
];

function StatusCard({
  currentStatus,
  onStatusChange,
  saving,
  error,
}: {
  currentStatus: LeadStatus;
  onStatusChange: (s: 'New' | 'Qualified' | 'Disqualified' | 'Unsubscribed') => void;
  saving: boolean;
  error: string | null;
}) {
  const { t } = useLocale();

  return (
    <Card>
      <h3 className="mb-1 text-sm font-semibold text-slate-900">{t('pages.leadDetail.statusCardTitle')}</h3>
      <p className="mb-4 text-xs text-slate-500">{t('pages.leadDetail.statusCardDesc')}</p>
      <div className="space-y-2">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = currentStatus === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => !saving && onStatusChange(opt.id)}
              disabled={saving}
              className={`w-full rounded-xl border p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive ? opt.activeClass : opt.idleClass
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 shrink-0 rounded-full ${opt.dotClass}`} />
                <p className={`flex-1 text-xs font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                  {t(`pages.leadDetail.${opt.labelKey}`)}
                </p>
                {isActive && (
                  <svg className="h-3.5 w-3.5 shrink-0 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {saving && (
        <p className="mt-3 text-center text-xs text-slate-500">{t('pages.leadDetail.statusSaving')}</p>
      )}
      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </Card>
  );
}

// ── Notes Card ─────────────────────────────────────────────────────────────────

function NotesCard({
  notes,
  noteText,
  onNoteChange,
  onAddNote,
  saving,
  error,
}: {
  notes: string | null;
  noteText: string;
  onNoteChange: (v: string) => void;
  onAddNote: () => void;
  saving: boolean;
  error: string | null;
}) {
  const { t } = useLocale();

  return (
    <Card>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {t('pages.leadDetail.sectionNotes')}
      </h3>
      {notes && (
        <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 px-3.5 py-3">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{notes}</p>
        </div>
      )}
      <div className="space-y-2">
        <textarea
          value={noteText}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder={t('pages.leadDetail.addNotePlaceholder')}
          rows={3}
          disabled={saving}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
        />
        <button
          onClick={onAddNote}
          disabled={saving || !noteText.trim()}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
        >
          {saving ? t('pages.leadDetail.addingNote') : t('pages.leadDetail.addNoteButton')}
        </button>
        {error && (
          <p className="text-xs font-medium text-red-600">{error}</p>
        )}
      </div>
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

// ── Loading skeleton ───────────────────────────────────────────────────────────

function LeadDetailSkeleton() {
  return (
    <div className="max-w-5xl space-y-6 animate-pulse">
      <div className="h-4 w-24 rounded bg-slate-100" />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="h-1.5 w-full bg-slate-100" />
        <div className="p-6 space-y-4">
          <div className="flex gap-5">
            <div className="h-16 w-16 rounded-2xl bg-slate-100" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-5 w-40 rounded bg-slate-100" />
              <div className="h-3.5 w-56 rounded bg-slate-100" />
              <div className="h-3 w-28 rounded bg-slate-100" />
            </div>
            <div className="h-16 w-16 rounded-full bg-slate-100" />
          </div>
          <div className="h-px bg-slate-100" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 rounded bg-slate-100" />)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <div className="h-48 rounded-xl bg-slate-100" />
          <div className="h-32 rounded-xl bg-slate-100" />
        </div>
        <div className="space-y-4">
          <div className="h-40 rounded-xl bg-slate-100" />
          <div className="h-32 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────

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
  const { t } = useLocale();

  const [lead, setLead]             = useState<Lead | null>(null);
  const [loading, setLoading]       = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const [messages, setMessages]     = useState<OutreachMessage[]>([]);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast]           = useState<string | null>(null);

  // Status update state
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError]   = useState<string | null>(null);

  // Note state
  const [noteText, setNoteText]     = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError]   = useState<string | null>(null);

  // ── Fetch lead ─────────────────────────────────────────────────────────────

  const fetchLead = useCallback(async () => {
    try {
      const data = await getLeadById(leadId);
      setLead(data);
      setIsFallback(false);
      setMessages(DUMMY_OUTREACH.filter((o) => o.leadId === leadId));
    } catch {
      const dummy = DUMMY_LEADS.find((l) => l.id === leadId) as Lead | undefined;
      setLead(dummy ?? null);
      setMessages(DUMMY_OUTREACH.filter((o) => o.leadId === leadId));
      setIsFallback(true);
    }
  }, [leadId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getLeadById(leadId)
      .then((data) => {
        if (cancelled) return;
        setLead(data);
        setIsFallback(false);
        setMessages(DUMMY_OUTREACH.filter((o) => o.leadId === leadId));
      })
      .catch(() => {
        if (cancelled) return;
        const dummy = DUMMY_LEADS.find((l) => l.id === leadId) as Lead | undefined;
        setLead(dummy ?? null);
        setMessages(DUMMY_OUTREACH.filter((o) => o.leadId === leadId));
        setIsFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [leadId]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  // ── Status change ──────────────────────────────────────────────────────────

  async function handleStatusChange(status: 'New' | 'Qualified' | 'Disqualified' | 'Unsubscribed') {
    if (!lead || statusSaving || lead.status === status) return;
    setStatusSaving(true);
    setStatusError(null);
    try {
      const updated = await updateLeadStatus(leadId, status);
      setLead(updated);
      showToast(t('pages.leadDetail.statusUpdatedToast'));
    } catch {
      setStatusError(t('pages.leadDetail.statusUpdateError'));
    } finally {
      setStatusSaving(false);
    }
  }

  // ── Add note ───────────────────────────────────────────────────────────────

  async function handleAddNote() {
    if (!lead || noteSaving || !noteText.trim()) return;
    setNoteSaving(true);
    setNoteError(null);
    try {
      const updated = await addLeadNote(leadId, noteText.trim());
      setLead(updated);
      setNoteText('');
      showToast(t('pages.leadDetail.noteAddedToast'));
    } catch {
      setNoteError(t('pages.leadDetail.noteAddError'));
    } finally {
      setNoteSaving(false);
    }
  }

  // ── Outreach helpers ───────────────────────────────────────────────────────

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
      showToast(t('pages.leadDetail.draftCreated'));
    }, 1200);
  }

  function handleMarkSent(id: string) {
    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: 'Sent', sentAt: new Date().toISOString() } : m)
    );
    showToast(t('pages.leadDetail.markedSent'));
  }

  function handleDiscard(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast(t('pages.leadDetail.draftDiscarded'));
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return <LeadDetailSkeleton />;
  }

  // ── 404 ────────────────────────────────────────────────────────────────────

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-slate-700">{t('pages.leadDetail.notFoundTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{t('pages.leadDetail.notFoundDesc')}</p>
        <Link href="/dashboard/leads" className="mt-5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800">
          {t('pages.leadDetail.backToLeadsLink')}
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
          {t('pages.leadDetail.backToLeads')}
        </Link>
      </nav>

      {/* ── Fallback banner ── */}
      {isFallback && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {t('pages.leadDetail.errorFallback')}
        </div>
      )}

      {/* ── Profile Hero Card ── */}
      <Card padding={false} className="overflow-hidden">
        <div className="h-1.5 w-full" style={{ backgroundColor: scoreColor }} />

        <div className="p-6">
          <div className="flex flex-wrap items-start gap-5">
            {/* Avatar */}
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-sm"
              style={{ backgroundColor: scoreColor }}
              aria-hidden="true"
            >
              {initials}
            </div>

            {/* Name + title + badges */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
                <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
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
                  <span className="text-xs font-medium text-slate-400">{t('pages.leadDetail.noScore')}</span>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {t('pages.leadDetail.pending')}
                </span>
              </div>
            )}
          </div>

          {/* Contact grid */}
          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <ContactItem
              icon={<IconEmail />}
              label={t('pages.leadDetail.contactEmail')}
              value={lead.email}
              href={`mailto:${lead.email}`}
            />
            {lead.phone && (
              <ContactItem
                icon={<IconPhone />}
                label={t('pages.leadDetail.contactPhone')}
                value={lead.phone}
                href={`tel:${lead.phone}`}
              />
            )}
            {lead.whatsapp && (
              <ContactItem
                icon={<IconWhatsApp />}
                label={t('pages.leadDetail.contactWhatsApp')}
                value={lead.whatsapp}
                href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
              />
            )}
            {lead.linkedInUrl && (
              <ContactItem
                icon={<IconLinkedIn />}
                label={t('pages.leadDetail.contactLinkedIn')}
                value={t('pages.leadDetail.viewProfile')}
                href={lead.linkedInUrl}
              />
            )}
            {lead.companyWebsite && (
              <ContactItem
                icon={<IconGlobe />}
                label={t('pages.leadDetail.contactWebsite')}
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
                  {t('pages.leadDetail.generating')}
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('pages.leadDetail.generateOutreach')}
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

      {/* ── Body ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Main column */}
        <div className="space-y-4 md:col-span-2">

          {/* Score Breakdown */}
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{t('pages.leadDetail.scoreBreakdownTitle')}</h2>
                <p className="mt-0.5 text-xs text-slate-500">{t('pages.leadDetail.scoreBreakdownDesc')}</p>
              </div>
              {lead.icpScore !== null && (
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums" style={{ color: scoreColor }}>
                    {lead.icpScore}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">/ 100</p>
                </div>
              )}
            </div>

            {lead.scoreBreakdown ? (
              <div className="space-y-4">
                <BreakdownBar label={t('pages.leadDetail.jobTitleMatch')}    value={lead.scoreBreakdown.jobTitleMatch}    max={30} />
                <BreakdownBar label={t('pages.leadDetail.industryMatch')}    value={lead.scoreBreakdown.industryMatch}    max={25} />
                <BreakdownBar label={t('pages.leadDetail.companySizeMatch')} value={lead.scoreBreakdown.companySizeMatch} max={15} />
                <BreakdownBar label={t('pages.leadDetail.painMatch')}        value={lead.scoreBreakdown.painMatch}        max={20} />
                <BreakdownBar label={t('pages.leadDetail.activitySignals')}  value={lead.scoreBreakdown.activitySignals}  max={10} />
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-500">{t('pages.leadDetail.totalScore')}</span>
                  <span className="text-base font-bold tabular-nums" style={{ color: scoreColor }}>
                    {lead.scoreBreakdown.total} / 100
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: t('pages.leadDetail.legendHighFit'), range: '70–100', cls: 'bg-emerald-50 text-emerald-700' },
                    { label: t('pages.leadDetail.legendMedFit'),  range: '45–69',  cls: 'bg-amber-50 text-amber-700'   },
                    { label: t('pages.leadDetail.legendLowFit'),  range: '0–44',   cls: 'bg-red-50 text-red-600'        },
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
                <p className="text-sm font-semibold text-slate-600">{t('pages.leadDetail.notYetScored')}</p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">{t('pages.leadDetail.scoringPending')}</p>
              </div>
            )}
          </Card>

          {/* Outreach Timeline */}
          <Card>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{t('pages.leadDetail.outreachHistoryTitle')}</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {messages.length === 1
                    ? t('pages.leadDetail.messageOnRecord').replace('{count}', '1')
                    : t('pages.leadDetail.messagesOnRecord').replace('{count}', String(messages.length))}
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

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Status management — connected to backend */}
          <StatusCard
            currentStatus={lead.status}
            onStatusChange={handleStatusChange}
            saving={statusSaving}
            error={statusError}
          />

          {(lead.industry || lead.companySize || lead.revenueRange) && (
            <Card>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t('pages.leadDetail.sectionCompany')}
              </h3>
              <div className="space-y-3">
                {lead.industry && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {t('pages.leadDetail.sectionIndustry')}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.industry}</p>
                  </div>
                )}
                {lead.companySize && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {t('pages.leadDetail.sectionCompanySize')}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.companySize}</p>
                  </div>
                )}
                {lead.revenueRange && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {t('pages.leadDetail.sectionRevenue')}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.revenueRange}</p>
                  </div>
                )}
                {lead.geography && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {t('pages.leadDetail.sectionLocation')}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-800">{lead.geography}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Notes — display existing + add new */}
          <NotesCard
            notes={lead.notes}
            noteText={noteText}
            onNoteChange={setNoteText}
            onAddNote={handleAddNote}
            saving={noteSaving}
            error={noteError}
          />

          <Card>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('pages.leadDetail.sectionLeadInfo')}
            </h3>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t('pages.leadDetail.statusLabel')}
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-700">{lead.status}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t('pages.leadDetail.sourceLabel')}
                </p>
                <p className="mt-0.5 text-sm text-slate-700">{lead.source}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {t('pages.leadDetail.importedLabel')}
                </p>
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

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
