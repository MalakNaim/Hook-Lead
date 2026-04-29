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

export default function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();

  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [outreachError, setOutreachError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getLeadById(leadId)
      .then(setLead)
      .catch((err) =>
        setLeadError(err instanceof Error ? err.message : 'Failed to load lead.')
      );

    getOutreachMessages(leadId)
      .then(setMessages)
      .catch((err) =>
        setOutreachError(err instanceof Error ? err.message : 'Failed to load messages.')
      );
  }, [leadId]);

  async function handleGenerate() {
    setGenerating(true);
    setOutreachError(null);
    try {
      const msg = await generateOutreachMessage(leadId);
      setMessages((prev) => [msg, ...prev]);
    } catch (err) {
      setOutreachError(err instanceof Error ? err.message : 'Failed to generate message.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleOpenDraft(messageId: string) {
    try {
      const draft = await getOutreachEmailDraft(messageId);
      window.open(draft.mailtoUrl, '_blank');
    } catch (err) {
      setOutreachError(err instanceof Error ? err.message : 'Failed to get email draft.');
    }
  }

  async function handleStatusUpdate(messageId: string, status: 'Sent' | 'Cancelled') {
    try {
      const updated = await updateOutreachMessageStatus(messageId, status);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? updated : m))
      );
    } catch (err) {
      setOutreachError(err instanceof Error ? err.message : 'Failed to update status.');
    }
  }

  if (leadError) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{leadError}</p>
    );
  }

  if (!lead) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/leads" className="hover:text-gray-900">Leads</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{lead.firstName} {lead.lastName}</span>
      </nav>

      {/* Lead details */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">
          {lead.firstName} {lead.lastName}
        </h1>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
          {[
            ['Email', lead.email],
            ['Job title', lead.jobTitle],
            ['Company', lead.company],
            ['Industry', lead.industry],
            ['Status', lead.status],
            ['ICP score', lead.icpScore !== null ? lead.icpScore : '—'],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-0.5 text-gray-900">{value ?? '—'}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Outreach section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Outreach</h2>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {generating ? 'Generating…' : 'Generate Draft'}
          </button>
        </div>

        {outreachError && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {outreachError}
          </p>
        )}

        {messages.length === 0 && !outreachError && (
          <p className="text-sm text-gray-400">No outreach messages yet.</p>
        )}

        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-gray-900">{msg.subject}</p>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                  {msg.status}
                </span>
              </div>
              <p className="mb-3 whitespace-pre-wrap text-sm text-gray-600 line-clamp-3">
                {msg.body}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                {msg.sentAt && (
                  <span>· Sent {new Date(msg.sentAt).toLocaleDateString()}</span>
                )}
              </div>

              {msg.status === 'Draft' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleOpenDraft(msg.id)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Open Email Draft
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(msg.id, 'Sent')}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500"
                  >
                    Mark as Sent
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(msg.id, 'Cancelled')}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
