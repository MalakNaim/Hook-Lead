'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ScoreRing, getScoreColor } from '@/components/ui/ScoreRing';
import { Badge, classificationVariant, statusVariant, enrichmentVariant } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useLocale } from '@/lib/i18n';
import {
  getLeadById,
  updateQualification,
  markHandoffReady,
  markHandoffSent,
} from '@/services/leadsService';
import {
  getOutreachMessages,
  generateOutreachMessage,
  updateOutreachMessageStatus,
} from '@/services/outreachService';
import { ApiError } from '@/lib/api';
import type { Lead, OutreachMessage, QualificationStatus } from '@/types';

type Tab = 'overview' | 'scoring' | 'outreach';

// ── Score breakdown bar ────────────────────────────────────────────────────────

function BreakdownBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 45 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="tabular-nums font-medium text-slate-700">{value} / {max}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Info Row ───────────────────────────────────────────────────────────────────

function InfoRow({ label, value, href, mono }: { label: string; value?: string | null; href?: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate">
          {value}
        </a>
      ) : (
        <p className={`text-sm text-slate-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
      )}
    </div>
  );
}

// ── Outreach Card ──────────────────────────────────────────────────────────────

function OutreachCard({
  lead,
  messages,
  onGenerate,
  onMarkSent,
  onDiscard,
}: {
  lead: Lead;
  messages: OutreachMessage[];
  onGenerate: () => Promise<void>;
  onMarkSent: (id: string) => Promise<void>;
  onDiscard: (id: string) => Promise<void>;
}) {
  const { t } = useLocale();
  const [generating, setGenerating] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const classification = lead.classification;
  const isEligible = classification === 'Hot' || classification === 'Warm';
  const isRejected = classification === 'Reject';
  const isCold = classification === 'Cold';
  const isUnscored = !classification;

  function eligibilityReason() {
    if (isRejected) return t('pages.leadDetail.outreachBlockedReject');
    if (isCold) return t('pages.leadDetail.outreachBlockedCold');
    if (isUnscored) return t('pages.leadDetail.outreachBlockedUnscored');
    return null;
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      await onGenerate();
    } finally {
      setGenerating(false);
    }
  }

  async function handleMarkSent(id: string) {
    setActioningId(id);
    try {
      await onMarkSent(id);
    } finally {
      setActioningId(null);
    }
  }

  async function handleDiscard(id: string) {
    setActioningId(id);
    try {
      await onDiscard(id);
    } finally {
      setActioningId(null);
    }
  }

  const reason = eligibilityReason();

  return (
    <div className="space-y-4">
      {/* Eligibility / Generate */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t('pages.leadDetail.outreachEligibilityTitle')}</h3>
            {reason ? (
              <p className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 max-w-sm">
                {reason}
              </p>
            ) : (
              <p className="mt-1 text-xs text-emerald-700">
                This lead is eligible for outreach.
              </p>
            )}
          </div>
          <button
            onClick={handleGenerate}
            disabled={!isEligible || generating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {generating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('pages.leadDetail.generating')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('pages.leadDetail.generateOutreach')}
              </>
            )}
          </button>
        </div>
      </Card>

      {/* Outreach history */}
      <Card>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          {t('pages.leadDetail.outreachHistoryTitle')}
          {messages.length > 0 && (
            <span className="ml-2 text-indigo-600 normal-case text-xs font-medium">
              {messages.length === 1
                ? t('pages.leadDetail.messageOnRecord').replace('{count}', '1')
                : t('pages.leadDetail.messagesOnRecord').replace('{count}', String(messages.length))}
            </span>
          )}
        </h3>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-600">{t('pages.leadDetail.noOutreach')}</p>
            <p className="mt-1 text-xs text-slate-400">{t('pages.leadDetail.noOutreachDesc')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 truncate">{msg.subject}</p>
                      <Badge variant={msg.status === 'Sent' ? 'qualified' : msg.status === 'Draft' ? 'warning' : 'neutral'}>
                        {msg.status === 'Cancelled' ? 'Discarded' : msg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed whitespace-pre-line">
                      {msg.body.split('\n').slice(0, 2).join(' ')}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <span>{t('pages.leadDetail.created')} {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {msg.sentAt && (
                        <span>{t('pages.leadDetail.sent')} {new Date(msg.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                </div>
                {msg.status === 'Draft' && (
                  <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleMarkSent(msg.id)}
                      disabled={actioningId === msg.id}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {actioningId === msg.id ? '…' : t('pages.leadDetail.markAsSent')}
                    </button>
                    <button
                      onClick={() => handleDiscard(msg.id)}
                      disabled={actioningId === msg.id}
                      className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      {t('pages.leadDetail.discard')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Qualification Card ─────────────────────────────────────────────────────────

function QualificationCard({
  lead,
  onSave,
}: {
  lead: Lead;
  onSave: (status: QualificationStatus, notes: string) => Promise<void>;
}) {
  const { t } = useLocale();
  const [selectedStatus, setSelectedStatus] = useState<QualificationStatus>(lead.qualificationStatus);
  const [notes, setNotes] = useState(lead.qualificationNotes ?? '');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const options: { value: QualificationStatus; label: string; desc: string; color: string; active: string }[] = [
    {
      value: 'QualifiedLead',
      label: t('pages.leadDetail.qualQualifiedLead'),
      desc: t('pages.leadDetail.qualOptionQualifiedDesc'),
      color: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      active: 'border-emerald-500 bg-emerald-100 ring-2 ring-emerald-300',
    },
    {
      value: 'NotQualified',
      label: t('pages.leadDetail.qualNotQualified'),
      desc: t('pages.leadDetail.qualOptionNotQualifiedDesc'),
      color: 'border-red-200 bg-red-50 text-red-800',
      active: 'border-red-500 bg-red-100 ring-2 ring-red-300',
    },
    {
      value: 'Nurturing',
      label: t('pages.leadDetail.qualNurturing'),
      desc: t('pages.leadDetail.qualOptionNurturingDesc'),
      color: 'border-amber-200 bg-amber-50 text-amber-800',
      active: 'border-amber-500 bg-amber-100 ring-2 ring-amber-300',
    },
  ];

  async function handleSave() {
    setSaving(true);
    setToast(null);
    try {
      await onSave(selectedStatus, notes);
      setToast({ ok: true, msg: t('pages.leadDetail.qualSavedToast') });
    } catch {
      setToast({ ok: false, msg: t('pages.leadDetail.qualSaveError') });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <Card>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{t('pages.leadDetail.manualQualTitle')}</h3>
      <p className="text-xs text-slate-500 mb-4">{t('pages.leadDetail.manualQualDesc')}</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedStatus(opt.value)}
            className={`text-left rounded-xl border p-3 transition-all ${
              selectedStatus === opt.value ? opt.active : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <p className={`text-xs font-semibold ${selectedStatus === opt.value ? '' : 'text-slate-700'}`}>
              {opt.label}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          {t('pages.leadDetail.qualificationNotesLabel')}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('pages.leadDetail.qualNotesPlaceholder')}
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saving ? t('pages.leadDetail.qualSaving') : t('pages.leadDetail.qualSaveBtn')}
        </button>
        {toast && (
          <span className={`text-xs font-medium ${toast.ok ? 'text-emerald-600' : 'text-red-600'}`}>
            {toast.msg}
          </span>
        )}
      </div>
    </Card>
  );
}

// ── Handoff Card ───────────────────────────────────────────────────────────────

function HandoffCard({
  lead,
  onMarkReady,
  onMarkSent,
}: {
  lead: Lead;
  onMarkReady: (target: string, notes: string) => Promise<void>;
  onMarkSent: () => Promise<void>;
}) {
  const { t } = useLocale();
  const [handoffTarget, setHandoffTarget] = useState(lead.handoffTarget ?? '');
  const [handoffNotes, setHandoffNotes] = useState(lead.handoffNotes ?? '');
  const [actioning, setActioning] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const canMarkReady = lead.qualificationStatus === 'QualifiedLead' && lead.handoffStatus === 'NotReady';
  const canMarkSent = lead.handoffStatus === 'Ready';

  async function handleMarkReady() {
    if (!canMarkReady) {
      setToast({ ok: false, msg: t('pages.leadDetail.handoffReadyError') });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setActioning(true);
    setToast(null);
    try {
      await onMarkReady(handoffTarget, handoffNotes);
      setToast({ ok: true, msg: t('pages.leadDetail.handoffReadyToast') });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('pages.leadDetail.handoffReadyError');
      setToast({ ok: false, msg });
    } finally {
      setActioning(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  async function handleMarkSent() {
    if (!canMarkSent) {
      setToast({ ok: false, msg: t('pages.leadDetail.handoffSentError') });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setActioning(true);
    setToast(null);
    try {
      await onMarkSent();
      setToast({ ok: true, msg: t('pages.leadDetail.handoffSentToast') });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t('pages.leadDetail.handoffSentError');
      setToast({ ok: false, msg });
    } finally {
      setActioning(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  const statusColor =
    lead.handoffStatus === 'Sent'
      ? 'bg-emerald-100 text-emerald-700'
      : lead.handoffStatus === 'Ready'
      ? 'bg-indigo-100 text-indigo-700'
      : 'bg-slate-100 text-slate-600';

  const statusLabel =
    lead.handoffStatus === 'Sent'
      ? t('pages.leadDetail.handoffSent')
      : lead.handoffStatus === 'Ready'
      ? t('pages.leadDetail.handoffReady')
      : t('pages.leadDetail.handoffNotReady');

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{t('pages.leadDetail.sectionHandoff')}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Deliver this lead to the sales team or CRM.</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {lead.handoffStatus === 'Sent' ? (
        <div className="space-y-2">
          {lead.handoffTarget && (
            <InfoRow label={t('pages.leadDetail.handoffTargetLabel')} value={lead.handoffTarget} />
          )}
          {lead.handoffAt && (
            <InfoRow
              label={t('pages.leadDetail.handoffAtLabel')}
              value={new Date(lead.handoffAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            />
          )}
          {lead.handoffNotes && (
            <InfoRow label={t('pages.leadDetail.handoffNotesLabel')} value={lead.handoffNotes} />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {lead.handoffStatus !== 'Ready' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t('pages.leadDetail.handoffTargetLabel')}
                </label>
                <input
                  type="text"
                  value={handoffTarget}
                  onChange={(e) => setHandoffTarget(e.target.value)}
                  placeholder={t('pages.leadDetail.handoffTargetPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  {t('pages.leadDetail.handoffNotesLabel')}
                </label>
                <textarea
                  value={handoffNotes}
                  onChange={(e) => setHandoffNotes(e.target.value)}
                  placeholder={t('pages.leadDetail.handoffNotesPlaceholder')}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
                />
              </div>
            </>
          )}

          {lead.handoffStatus === 'Ready' && (
            <div className="space-y-1.5">
              {lead.handoffTarget && (
                <InfoRow label={t('pages.leadDetail.handoffTargetLabel')} value={lead.handoffTarget} />
              )}
              {lead.handoffNotes && (
                <InfoRow label={t('pages.leadDetail.handoffNotesLabel')} value={lead.handoffNotes} />
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            {lead.handoffStatus === 'NotReady' && (
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleMarkReady}
                  disabled={!canMarkReady || actioning}
                  title={!canMarkReady ? t('pages.leadDetail.handoffReadyError') : undefined}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actioning ? '…' : t('pages.leadDetail.markHandoffReady')}
                </button>
                {!canMarkReady && (
                  <p className="text-xs text-slate-400">{t('pages.leadDetail.handoffReadyError')}</p>
                )}
              </div>
            )}
            {lead.handoffStatus === 'Ready' && (
              <button
                onClick={handleMarkSent}
                disabled={actioning}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {actioning ? '…' : t('pages.leadDetail.markHandoffSent')}
              </button>
            )}
            {toast && (
              <span className={`text-xs font-medium ${toast.ok ? 'text-emerald-600' : 'text-red-600'}`}>
                {toast.msg}
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const { t } = useLocale();

  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('overview');

  const fetchData = useCallback(async () => {
    if (!leadId) return;
    try {
      const [leadData, msgs] = await Promise.all([
        getLeadById(leadId),
        getOutreachMessages(leadId),
      ]);
      setLead(leadData);
      setMessages(msgs);
    } catch {
      setError(t('pages.leadDetail.errorFallback'));
    } finally {
      setLoading(false);
    }
  }, [leadId, t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = useCallback(async () => {
    if (!leadId) return;
    const msg = await generateOutreachMessage(leadId);
    setMessages((prev) => [msg, ...prev]);
    setTab('outreach');
  }, [leadId]);

  const handleMarkSentMessage = useCallback(async (messageId: string) => {
    const updated = await updateOutreachMessageStatus(messageId, 'Sent');
    setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
  }, []);

  const handleDiscardMessage = useCallback(async (messageId: string) => {
    const updated = await updateOutreachMessageStatus(messageId, 'Cancelled');
    setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
  }, []);

  const handleSaveQualification = useCallback(
    async (status: QualificationStatus, notes: string) => {
      if (!leadId) return;
      const updated = await updateQualification(leadId, status, notes || undefined);
      setLead(updated);
    },
    [leadId],
  );

  const handleMarkHandoffReady = useCallback(
    async (target: string, notes: string) => {
      if (!leadId) return;
      const updated = await markHandoffReady(leadId, target || undefined, notes || undefined);
      setLead(updated);
    },
    [leadId],
  );

  const handleMarkHandoffSent = useCallback(async () => {
    if (!leadId) return;
    const updated = await markHandoffSent(leadId);
    setLead(updated);
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="ml-3 text-sm text-slate-500">{t('pages.leadDetail.loading')}</span>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-lg font-semibold text-slate-700">{t('pages.leadDetail.notFoundTitle')}</h2>
        <p className="mt-1 text-sm text-slate-500">{error ?? t('pages.leadDetail.notFoundDesc')}</p>
        <Link href="/leads" className="mt-5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          {t('pages.leadDetail.backToLeadsLink')}
        </Link>
      </div>
    );
  }

  const fullName = `${lead.firstName} ${lead.lastName}`;
  const initials = `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`;
  const scoreColor = lead.icpScore !== null ? getScoreColor(lead.icpScore) : '#94a3b8';

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('pages.leadDetail.tabOverview') },
    { id: 'scoring', label: t('pages.leadDetail.tabScoring') },
    {
      id: 'outreach',
      label: `${t('pages.leadDetail.tabOutreach')}${messages.length > 0 ? ` (${messages.length})` : ''}`,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="inline-flex items-center gap-1.5 text-sm">
        <Link href="/leads" className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('pages.leadDetail.backToLeads')}
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-700 font-medium">{fullName}</span>
      </nav>

      {/* Profile Card */}
      <Card className="overflow-hidden" padding={false}>
        <div className="h-1.5 w-full" style={{ backgroundColor: scoreColor }} />
        <div className="p-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
              style={{ backgroundColor: scoreColor }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
                {lead.classification && (
                  <Badge variant={classificationVariant(lead.classification)}>{lead.classification}</Badge>
                )}
                <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
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
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {lead.geography}
                </p>
              )}
            </div>
            {lead.icpScore !== null && (
              <div className="shrink-0">
                <ScoreRing score={lead.icpScore} size="lg" showLabel />
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2 flex-wrap border-t border-slate-100 pt-4">
            {lead.linkedInUrl && (
              <a
                href={lead.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            )}
            {lead.enrichmentStatus && (
              <Badge variant={enrichmentVariant(lead.enrichmentStatus)}>{lead.enrichmentStatus}</Badge>
            )}
            {lead.source && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {lead.source}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-0.5 -mb-px">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3.5">
              <InfoRow label={t('pages.leadDetail.contactEmail')} value={lead.email} href={`mailto:${lead.email}`} />
              <InfoRow label={t('pages.leadDetail.contactPhone')} value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
              <InfoRow label={t('pages.leadDetail.contactWhatsApp')} value={lead.whatsapp} href={lead.whatsapp ? `https://wa.me/${lead.whatsapp.replace(/\D/g, '')}` : undefined} />
              <InfoRow label={t('pages.leadDetail.contactLinkedIn')} value={lead.linkedInUrl ? t('pages.leadDetail.viewProfile') : null} href={lead.linkedInUrl ?? undefined} />
              <InfoRow label={t('pages.leadDetail.contactWebsite')} value={lead.companyWebsite} href={lead.companyWebsite ?? undefined} />
            </div>
          </Card>

          <Card>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{t('pages.leadDetail.sectionCompany')}</h3>
            <div className="space-y-3.5">
              <InfoRow label={t('pages.leadDetail.sectionCompany')} value={lead.company} />
              <InfoRow label={t('pages.leadDetail.sectionIndustry')} value={lead.industry} />
              <InfoRow label={t('pages.leadDetail.sectionCompanySize')} value={lead.companySize} />
              <InfoRow label={t('pages.leadDetail.sectionRevenue')} value={lead.revenueRange} />
              <InfoRow label={t('pages.leadDetail.sectionLocation')} value={lead.geography} />
            </div>
          </Card>

          {lead.notes && (
            <Card className="md:col-span-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t('pages.leadDetail.sectionNotes')}</h3>
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3.5">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{lead.notes}</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Scoring tab */}
      {tab === 'scoring' && (
        <div className="space-y-4">
          {lead.scoreBreakdown ? (
            <>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{t('pages.leadDetail.scoreBreakdownTitle')}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{t('pages.leadDetail.scoreBreakdownDesc')}</p>
                  </div>
                  <ScoreRing score={lead.scoreBreakdown.total} size="xl" showLabel />
                </div>
                <div className="space-y-5">
                  <BreakdownBar label={t('pages.leadDetail.jobTitleMatch')} value={lead.scoreBreakdown.jobTitleMatch} max={30} />
                  <BreakdownBar label={t('pages.leadDetail.industryMatch')} value={lead.scoreBreakdown.industryMatch} max={25} />
                  <BreakdownBar label={t('pages.leadDetail.companySizeMatch')} value={lead.scoreBreakdown.companySizeMatch} max={15} />
                  <BreakdownBar label={t('pages.leadDetail.painMatch')} value={lead.scoreBreakdown.painMatch} max={20} />
                  <BreakdownBar label={t('pages.leadDetail.activitySignals')} value={lead.scoreBreakdown.activitySignals} max={10} />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500">{t('pages.leadDetail.totalScore')}</p>
                  <p className="text-lg font-bold" style={{ color: getScoreColor(lead.scoreBreakdown.total) }}>
                    {lead.scoreBreakdown.total} / 100
                  </p>
                </div>
              </Card>
              <Card>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Scoring Guide</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: t('pages.leadDetail.legendHighFit'), range: '70–100', color: 'bg-emerald-100 text-emerald-700' },
                    { label: t('pages.leadDetail.legendMedFit'), range: '45–69', color: 'bg-amber-100 text-amber-700' },
                    { label: t('pages.leadDetail.legendLowFit'), range: '0–44', color: 'bg-red-100 text-red-700' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg px-3 py-2 ${item.color}`}>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-xs opacity-70">{item.range}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card>
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-600">{t('pages.leadDetail.notYetScored')}</p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">{t('pages.leadDetail.scoringPending')}</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Outreach tab — Outreach + Qualification + Handoff */}
      {tab === 'outreach' && (
        <div className="space-y-6">
          <OutreachCard
            lead={lead}
            messages={messages}
            onGenerate={handleGenerate}
            onMarkSent={handleMarkSentMessage}
            onDiscard={handleDiscardMessage}
          />

          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t('pages.leadDetail.manualQualTitle')}
            </h2>
            <QualificationCard lead={lead} onSave={handleSaveQualification} />
          </div>

          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {t('pages.leadDetail.sectionHandoff')}
            </h2>
            <HandoffCard
              lead={lead}
              onMarkReady={handleMarkHandoffReady}
              onMarkSent={handleMarkHandoffSent}
            />
          </div>
        </div>
      )}
    </div>
  );
}
