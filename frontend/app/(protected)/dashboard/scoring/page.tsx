'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLeads } from '@/services/leadsService';
import type { LeadSummary } from '@/types';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge, statusVariant, classificationVariant } from '@/components/ui/Badge';
import { useLocale } from '@/lib/i18n';

// ── Score badge (inline, no ring SVG needed in table) ─────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 71 ? 'text-emerald-700 bg-emerald-50' :
    score >= 41 ? 'text-amber-700 bg-amber-50' :
                  'text-red-600 bg-red-50';
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${cls}`}>
      {score}
    </span>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-4 py-3">
        <div className="h-3.5 w-32 rounded bg-gray-100 animate-pulse" />
        <div className="mt-1.5 h-2.5 w-24 rounded bg-gray-100 animate-pulse" />
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <div className="h-5 w-16 rounded-full bg-gray-100 animate-pulse" />
      </td>
      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="h-5 w-14 rounded-full bg-gray-100 animate-pulse" />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="ms-auto h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
      </td>
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
      <div className="mx-auto mb-1.5 h-7 w-10 rounded bg-gray-100 animate-pulse" />
      <div className="mx-auto h-3 w-16 rounded bg-gray-100 animate-pulse" />
      <div className="mx-auto mt-1 h-2.5 w-20 rounded bg-gray-100 animate-pulse" />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ScoringPage() {
  const { t } = useLocale();
  const router = useRouter();

  const [leads, setLeads] = useState<LeadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const result = await getLeads({ page: 1, pageSize: 500 });
      setLeads(result.items);
    } catch {
      setHasError(true);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const scoredLeads = useMemo(
    () =>
      leads
        .filter((l) => l.icpScore !== null)
        .sort((a, b) => (b.icpScore ?? 0) - (a.icpScore ?? 0)),
    [leads],
  );

  const unscoredLeads = useMemo(
    () => leads.filter((l) => l.icpScore === null),
    [leads],
  );

  const distribution = useMemo(
    () => ({
      high:     leads.filter((l) => l.icpScore !== null && l.icpScore >= 71).length,
      medium:   leads.filter((l) => l.icpScore !== null && l.icpScore >= 41 && l.icpScore <= 70).length,
      low:      leads.filter((l) => l.icpScore !== null && l.icpScore <= 40).length,
      unscored: leads.filter((l) => l.icpScore === null).length,
    }),
    [leads],
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{t('pages.scoring.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('pages.scoring.description')}</p>
      </div>

      {/* Error banner */}
      {hasError && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{t('pages.scoring.errorFallback')}</span>
          <button
            onClick={fetchLeads}
            className="ms-4 font-medium underline hover:no-underline"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {/* Distribution summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-2xl font-semibold text-emerald-600">{distribution.high}</p>
              <p className="mt-0.5 text-xs text-gray-600">{t('pages.scoring.highFit')}</p>
              <p className="text-[11px] text-gray-400">{t('pages.scoring.highFitRange')}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-2xl font-semibold text-amber-600">{distribution.medium}</p>
              <p className="mt-0.5 text-xs text-gray-600">{t('pages.scoring.mediumFit')}</p>
              <p className="text-[11px] text-gray-400">{t('pages.scoring.mediumFitRange')}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-2xl font-semibold text-red-500">{distribution.low}</p>
              <p className="mt-0.5 text-xs text-gray-600">{t('pages.scoring.lowFit')}</p>
              <p className="text-[11px] text-gray-400">{t('pages.scoring.lowFitRange')}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <p className="text-2xl font-semibold text-gray-400">{distribution.unscored}</p>
              <p className="mt-0.5 text-xs text-gray-600">{t('pages.scoring.unscoredLabel')}</p>
              <p className="text-[11px] text-gray-400">{t('pages.scoring.unscoredSub')}</p>
            </div>
          </>
        )}
      </div>

      {/* Empty state — no leads at all */}
      {!loading && !hasError && leads.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-8 py-12 text-center">
          <p className="text-sm font-medium text-gray-600">{t('pages.scoring.emptyTitle')}</p>
          <p className="mt-1 text-xs text-gray-400">{t('pages.scoring.emptyDesc')}</p>
          <Link
            href="/dashboard/import"
            className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            {t('pages.leads.importLeads')}
          </Link>
        </div>
      )}

      {/* Scored leads table */}
      {(loading || (!hasError && leads.length > 0)) && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">{t('pages.scoring.scoredLeadsTitle')}</h2>
            <Link
              href="/dashboard/leads"
              className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              {t('pages.scoring.viewAll')}
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {!loading && scoredLeads.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-gray-500">{t('pages.scoring.noScoredLeads')}</p>
                <p className="mt-1 text-xs text-gray-400">{t('pages.scoring.noScoredLeadsDesc')}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-start">{t('pages.scoring.colLead')}</th>
                    <th className="hidden px-4 py-3 text-start sm:table-cell">{t('pages.scoring.colCompany')}</th>
                    <th className="hidden px-4 py-3 text-start md:table-cell">{t('pages.scoring.colStatus')}</th>
                    <th className="hidden px-4 py-3 text-start lg:table-cell">{t('pages.scoring.colClassification')}</th>
                    <th className="px-4 py-3 text-end">{t('pages.scoring.colIcpScore')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                    : scoredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                          className="cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </span>
                            {lead.jobTitle && (
                              <p className="text-xs text-gray-400">{lead.jobTitle}</p>
                            )}
                          </td>
                          <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                            {lead.company ?? '—'}
                          </td>
                          <td className="hidden px-4 py-3 md:table-cell">
                            <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
                          </td>
                          <td className="hidden px-4 py-3 lg:table-cell">
                            {lead.classification ? (
                              <Badge variant={classificationVariant(lead.classification)}>
                                {lead.classification}
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-end">
                            <ScoreBadge score={lead.icpScore!} />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Unscored leads */}
      {!loading && !hasError && unscoredLeads.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-gray-900">{t('pages.scoring.unscoredLeadsTitle')}</h2>
          <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {unscoredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </span>
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      {lead.company ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <span className="text-xs text-gray-400">{t('pages.scoring.notScored')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-400">{t('pages.scoring.unscoredNote')}</p>
        </div>
      )}
    </div>
  );
}
