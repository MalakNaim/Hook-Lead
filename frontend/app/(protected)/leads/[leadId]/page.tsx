'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getLeadById } from '@/services/leadsService';
import {
  getOutreachMessages,
  generateOutreachMessage,
  getOutreachEmailDraft,
  updateOutreachMessageStatus,
} from '@/services/outreachService';
import type { Lead, OutreachMessage } from '@/types';

function leadStatusBadge(status: string): string {
  switch (status.toLowerCase()) {
    case 'new':          return 'bg-blue-50 text-blue-700';
    case 'contacted':    return 'bg-amber-50 text-amber-700';
    case 'qualified':    return 'bg-green-50 text-green-700';
    case 'disqualified': return 'bg-red-50 text-red-700';
    default:             return 'bg-gray-100 text-gray-600';
  }
}

function outreachStatusBadge(status: string): string {
  switch (status) {
    case 'Draft':     return 'bg-amber-50 text-amber-700';
    case 'Sent':      return 'bg-green-50 text-green-700';
    case 'Cancelled': return 'bg-gray-100 text-gray-500';
    default:          return 'bg-gray-100 text-gray-600';
  }
}

function scoreColor(score: number): string {
  if (score >= 71) return 'text-green-600';
  if (score >= 41) return 'text-amber-600';
  return 'text-red-500';
}

function scoreBarColor(score: number): string {
  if (score >= 71) return 'bg-green-500';
  if (score >= 41) return 'bg-amber-400';
  return 'bg-red-400';
}

function sortNewestFirst(msgs: OutreachMessage[]): OutreachMessage[] {
  return [...msgs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();

  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [outreachError, setOutreachError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getLeadById(leadId)
      .then(setLead)
      .catch((err) =>
        setLeadError(err instanceof Error ? err.message : 'Failed to load lead.')
      );

    getOutreachMessages(leadId)
      .then((msgs) => setMessages(sortNewestFirst(msgs)))
      .catch((err) =>
        setOutreachError(err instanceof Error ? err.message : 'Failed to load messages.')
      );
  }, [leadId]);

  function showSuccess(msg: string) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  function setMsgLoading(id: string, val: boolean) {
    setActionLoading((prev) => ({ ...prev, [id]: val }));
  }

  async function handleGenerate() {
    setGenerating(true);
    setOutreachError(null);
    try {
      const msg = await generateOutreachMessage(leadId);
      setMessages((prev) => sortNewestFirst([msg, ...prev]));
      showSuccess('Outreach draft generated.');
    } catch (err) {
      setOutreachError(err instanceof Error ? err.message : 'Failed to generate message.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleOpenDraft(messageId: string) {
    setMsgLoading(messageId, true);
    try {
      const draft = await getOutreachEmailDraft(messageId);
      window.open(draft.mailtoUrl, '_blank');
    } catch (err) {
      setOutreachError(err instanceof Error ? err.message : 'Failed to get email draft.');
    } finally {
      setMsgLoading(messageId, false);
    }
  }

  async function handleStatusUpdate(messageId: string, status: 'Sent' | 'Cancelled') {
    setMsgLoading(messageId, true);
    setOutreachError(null);
    try {
      const updated = await updateOutreachMessageStatus(messageId, status);
      setMessages((prev) =>
        sortNewestFirst(prev.map((m) => (m.id === messageId ? updated : m)))
      );
      showSuccess(status === 'Sent' ? 'Message marked as sent.' : 'Message cancelled.');
    } catch (err) {
      setOutreachError(err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setMsgLoading(messageId, false);
    }
  }

  if (leadError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-700">{leadError}</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
        <Spinner className="h-4 w-4 text-gray-400" />
        Loading lead…
      </div>
    );
  }

  const initials =
    `${lead.firstName[0] ?? ''}${lead.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/leads" className="hover:text-gray-900">
          Leads
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">
          {lead.firstName} {lead.lastName}
        </span>
      </nav>

      {/* Lead profile card */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-600">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {lead.firstName} {lead.lastName}
            </h1>
            {(lead.jobTitle || lead.company) && (
              <p className="mt-0.5 text-sm text-gray-500">
                {[lead.jobTitle, lead.company].filter(Boolean).join(' · ')}
              </p>
            )}
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${leadStatusBadge(lead.status)}`}
            >
              {lead.status}
            </span>
          </div>
          {lead.icpScore !== null && (
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                ICP Score
              </p>
              <p className={`text-2xl font-bold ${scoreColor(lead.icpScore)}`}>
                {lead.icpScore}
              </p>
              <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${scoreBarColor(lead.icpScore)}`}
                  style={{ width: `${lead.icpScore}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Email</dt>
            <dd className="mt-0.5 break-all text-gray-900">{lead.email}</dd>
          </div>
          {lead.industry && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Industry</dt>
              <dd className="mt-0.5 text-gray-900">{lead.industry}</dd>
            </div>
          )}
          {lead.geography && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Location</dt>
              <dd className="mt-0.5 text-gray-900">{lead.geography}</dd>
            </div>
          )}
          {lead.companySize && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Company size</dt>
              <dd className="mt-0.5 text-gray-900">{lead.companySize}</dd>
            </div>
          )}
          {lead.revenueRange && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Revenue</dt>
              <dd className="mt-0.5 text-gray-900">{lead.revenueRange}</dd>
            </div>
          )}
          {lead.linkedInUrl && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">LinkedIn</dt>
              <dd className="mt-0.5">
                <a
                  href={lead.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View profile
                </a>
              </dd>
            </div>
          )}
          {lead.notes && (
            <div className="col-span-2 sm:col-span-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-gray-900">{lead.notes}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Outreach section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Outreach
            {messages.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({messages.length})
              </span>
            )}
          </h2>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Spinner className="h-3.5 w-3.5 text-white" />
                Generating…
              </>
            ) : (
              'Generate Outreach'
            )}
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5">
            <p className="text-sm text-green-700">{successMsg}</p>
          </div>
        )}

        {outreachError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{outreachError}</p>
          </div>
        )}

        {messages.length === 0 && !outreachError && (
          <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
            <p className="text-sm font-medium text-gray-400">No outreach messages yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Click &ldquo;Generate Outreach&rdquo; to create a personalized draft.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg) => {
            const busy = actionLoading[msg.id] ?? false;
            return (
              <div key={msg.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold leading-snug text-gray-900">
                    {msg.subject}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${outreachStatusBadge(msg.status)}`}
                  >
                    {msg.status}
                  </span>
                </div>

                <p className="mb-4 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                  {msg.body}
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Created {new Date(msg.createdAt).toLocaleDateString()}</span>
                    {msg.sentAt && (
                      <span className="text-green-600">
                        · Sent {new Date(msg.sentAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {msg.status === 'Draft' && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => handleOpenDraft(msg.id)}
                        disabled={busy}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Open Email Draft
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(msg.id, 'Sent')}
                        disabled={busy}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-500 disabled:opacity-50"
                      >
                        {busy ? 'Saving…' : 'Mark as Sent'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(msg.id, 'Cancelled')}
                        disabled={busy}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
