'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DUMMY_LEADS, DUMMY_OUTREACH } from '@/lib/dummy-data';
import { ScoreRing, getScoreColor } from '@/components/ui/ScoreRing';
import { Badge, classificationVariant, statusVariant, enrichmentVariant } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

type Tab = 'overview' | 'scoring' | 'outreach';

// ── Score breakdown bar ────────────────────────────────────────────────────────

function BreakdownBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = (value / max) * 100;
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 45 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="tabular-nums font-medium text-slate-700">
          {value} / {max}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Info Row ───────────────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  href,
  mono,
}: {
  label: string;
  value?: string | null;
  href?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline truncate"
        >
          {value}
        </a>
      ) : (
        <p className={`text-sm text-slate-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const [tab, setTab] = useState<Tab>('overview');
  const [outreachMessages, setOutreachMessages] = useState(() =>
    DUMMY_OUTREACH.filter((o) => o.id === leadId || o.leadId === leadId)
  );
  const [generating, setGenerating] = useState(false);

  const lead = useMemo(() => DUMMY_LEADS.find((l) => l.id === leadId), [leadId]);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-lg font-semibold text-slate-700">Lead not found</h2>
        <p className="mt-1 text-sm text-slate-500">
          This lead doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/leads"
          className="mt-5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back to Leads
        </Link>
      </div>
    );
  }

  const fullName = `${lead.firstName} ${lead.lastName}`;
  const initials = `${lead.firstName[0]}${lead.lastName[0]}`;
  const scoreColor = lead.icpScore !== null ? getScoreColor(lead.icpScore) : '#94a3b8';

  function handleGenerateOutreach() {
    if (!lead) return;
    setGenerating(true);
    setTimeout(() => {
      const newMsg = {
        id: `gen-${Date.now()}`,
        leadId: lead.id,
        subject: `Reaching out — ${lead.company} × Hook Leads`,
        body: `Hi ${lead.firstName},\n\nI came across your profile and was impressed by your work at ${lead.company}. Given your role as ${lead.jobTitle}, I thought Hook Leads could be a strong fit for how you approach lead qualification.\n\nWe help teams like yours score and prioritize leads 10x faster using AI, then generate personalized outreach in seconds.\n\nWould you be open to a quick 20-minute call this week?\n\nBest,\nYazan`,
        status: 'Draft' as const,
        createdAt: new Date().toISOString(),
        sentAt: null,
      };
      setOutreachMessages((prev) => [newMsg, ...prev]);
      setGenerating(false);
      setTab('outreach');
    }, 1200);
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'scoring', label: 'Scoring' },
    { id: 'outreach', label: `Outreach (${outreachMessages.length})` },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="inline-flex items-center gap-1.5 text-sm">
        <Link
          href="/leads"
          className="text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Leads
        </Link>
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-700 font-medium">{fullName}</span>
      </nav>

      {/* Profile Card */}
      <Card className="overflow-hidden" padding={false}>
        {/* Colored accent top bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: scoreColor }} />
        <div className="p-6">
          <div className="flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
              style={{ backgroundColor: scoreColor }}
            >
              {initials}
            </div>

            {/* Name / title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{fullName}</h1>
                {lead.classification && (
                  <Badge variant={classificationVariant(lead.classification)}>
                    {lead.classification}
                  </Badge>
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

            {/* Score */}
            {lead.icpScore !== null && (
              <div className="shrink-0">
                <ScoreRing score={lead.icpScore} size="lg" showLabel />
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="mt-5 flex items-center gap-2 flex-wrap border-t border-slate-100 pt-4">
            <button
              onClick={handleGenerateOutreach}
              disabled={generating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            )}
            {lead.enrichmentStatus && (
              <Badge variant={enrichmentVariant(lead.enrichmentStatus)}>
                {lead.enrichmentStatus}
              </Badge>
            )}
            {lead.source && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
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

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <div className="space-y-3.5">
              <InfoRow label="Email" value={lead.email} href={`mailto:${lead.email}`} />
              <InfoRow label="Phone" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
              <InfoRow label="WhatsApp" value={lead.whatsapp} href={lead.whatsapp ? `https://wa.me/${lead.whatsapp.replace(/\D/g, '')}` : undefined} />
              <InfoRow label="LinkedIn" value={lead.linkedInUrl ? 'View Profile' : null} href={lead.linkedInUrl ?? undefined} />
              <InfoRow label="Website" value={lead.companyWebsite} href={lead.companyWebsite ?? undefined} />
            </div>
          </Card>

          <Card>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Company
            </h3>
            <div className="space-y-3.5">
              <InfoRow label="Company" value={lead.company} />
              <InfoRow label="Industry" value={lead.industry} />
              <InfoRow label="Company Size" value={lead.companySize} />
              <InfoRow label="Revenue Range" value={lead.revenueRange} />
              <InfoRow label="Location" value={lead.geography} />
            </div>
          </Card>

          {lead.notes && (
            <Card className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</h3>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3.5">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {lead.notes}
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'scoring' && (
        <div className="space-y-4">
          {lead.scoreBreakdown ? (
            <>
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">ICP Score Breakdown</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      How this lead matches your ICP across 5 dimensions
                    </p>
                  </div>
                  <ScoreRing score={lead.scoreBreakdown.total} size="xl" showLabel />
                </div>
                <div className="space-y-5">
                  <BreakdownBar
                    label="Job Title Match"
                    value={lead.scoreBreakdown.jobTitleMatch}
                    max={30}
                  />
                  <BreakdownBar
                    label="Industry Match"
                    value={lead.scoreBreakdown.industryMatch}
                    max={25}
                  />
                  <BreakdownBar
                    label="Company Size Match"
                    value={lead.scoreBreakdown.companySizeMatch}
                    max={15}
                  />
                  <BreakdownBar
                    label="Pain Point Match"
                    value={lead.scoreBreakdown.painMatch}
                    max={20}
                  />
                  <BreakdownBar
                    label="Activity / Signals"
                    value={lead.scoreBreakdown.activitySignals}
                    max={10}
                  />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500">Total Score</p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(lead.scoreBreakdown.total) }}
                  >
                    {lead.scoreBreakdown.total} / 100
                  </p>
                </div>
              </Card>

              <Card>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Scoring Guide
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'High Fit', range: '70–100', color: 'bg-emerald-100 text-emerald-700' },
                    { label: 'Medium Fit', range: '45–69', color: 'bg-amber-100 text-amber-700' },
                    { label: 'Low Fit', range: '0–44', color: 'bg-red-100 text-red-700' },
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
                <p className="text-sm font-semibold text-slate-600">Not yet scored</p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">
                  This lead hasn&apos;t been scored against your ICP yet. Scoring runs automatically
                  once enrichment is complete.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'outreach' && (
        <div className="space-y-3">
          {outreachMessages.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-600">No outreach yet</p>
                <p className="mt-1 text-xs text-slate-400">
                  Click &ldquo;Generate Outreach&rdquo; to create a personalized message.
                </p>
              </div>
            </Card>
          ) : (
            outreachMessages.map((msg) => (
              <Card key={msg.id} padding={false} className="overflow-hidden">
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {msg.subject}
                      </p>
                      <Badge
                        variant={
                          msg.status === 'Sent'
                            ? 'qualified'
                            : msg.status === 'Draft'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {msg.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {msg.body.split('\n')[2] || msg.body.slice(0, 120)}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        Created{' '}
                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {msg.sentAt && (
                        <span>
                          Sent{' '}
                          {new Date(msg.sentAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {msg.status === 'Draft' && (
                  <div className="px-5 pb-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() =>
                        setOutreachMessages((prev) =>
                          prev.map((m) =>
                            m.id === msg.id
                              ? { ...m, status: 'Sent', sentAt: new Date().toISOString() }
                              : m
                          )
                        )
                      }
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Mark as Sent
                    </button>
                    <button
                      onClick={() =>
                        setOutreachMessages((prev) =>
                          prev.map((m) =>
                            m.id === msg.id ? { ...m, status: 'Cancelled' } : m
                          )
                        )
                      }
                      className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      Discard
                    </button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
