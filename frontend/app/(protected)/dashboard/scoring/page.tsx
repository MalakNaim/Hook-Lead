'use client';

import Link from 'next/link';
import { DUMMY_LEAD_SUMMARIES, SCORE_DISTRIBUTION } from '@/lib/dummy-data';
import { useLocale } from '@/lib/i18n';

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 71 ? 'text-green-600 bg-green-50' :
    score >= 41 ? 'text-amber-600 bg-amber-50' :
    'text-red-500 bg-red-50';

  return (
    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

export default function ScoringPage() {
  const { t } = useLocale();

  const scoredLeads = DUMMY_LEAD_SUMMARIES.filter((l) => l.icpScore !== null)
    .sort((a, b) => (b.icpScore ?? 0) - (a.icpScore ?? 0));

  const unscoredLeads = DUMMY_LEAD_SUMMARIES.filter((l) => l.icpScore === null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t('pages.scoring.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('pages.scoring.description')}</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {t('pages.scoring.comingSoon')}
        </div>
      </div>

      {/* Distribution strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-green-600">{SCORE_DISTRIBUTION.high}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('pages.scoring.highFit')}</p>
          <p className="text-[11px] text-gray-400">{t('pages.scoring.highFitRange')}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-amber-600">{SCORE_DISTRIBUTION.medium}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('pages.scoring.mediumFit')}</p>
          <p className="text-[11px] text-gray-400">{t('pages.scoring.mediumFitRange')}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-red-500">{SCORE_DISTRIBUTION.low}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('pages.scoring.lowFit')}</p>
          <p className="text-[11px] text-gray-400">{t('pages.scoring.lowFitRange')}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-gray-400">{SCORE_DISTRIBUTION.unscored}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('pages.scoring.unscoredLabel')}</p>
          <p className="text-[11px] text-gray-400">{t('pages.scoring.unscoredSub')}</p>
        </div>
      </div>

      {/* Scored leads table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{t('pages.scoring.scoredLeadsTitle')}</h2>
          <Link href="/dashboard/leads" className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors">
            {t('pages.scoring.viewAll')}
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">{t('pages.scoring.colLead')}</th>
                <th className="px-4 py-3 hidden sm:table-cell">{t('pages.scoring.colCompany')}</th>
                <th className="px-4 py-3 hidden md:table-cell">{t('pages.scoring.colStatus')}</th>
                <th className="px-4 py-3 text-right">{t('pages.scoring.colIcpScore')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scoredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-gray-900 hover:text-gray-700">
                      {lead.firstName} {lead.lastName}
                    </Link>
                    {lead.jobTitle && (
                      <p className="text-xs text-gray-400">{lead.jobTitle}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                    {lead.company ?? '—'}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      lead.status === 'Qualified' ? 'bg-green-50 text-green-700' :
                      lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700' :
                      lead.status === 'New'       ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ScoreRing score={lead.icpScore!} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unscored leads */}
      {unscoredLeads.length > 0 && (
        <div>
          <h2 className="mb-4 text-base font-semibold text-gray-900">{t('pages.scoring.unscoredLeadsTitle')}</h2>
          <div className="overflow-hidden rounded-xl border border-dashed border-gray-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {unscoredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-gray-900 hover:text-gray-700">
                        {lead.firstName} {lead.lastName}
                      </Link>
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{lead.company ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
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

      {/* Coming soon card */}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
          <svg className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-gray-900">{t('pages.scoring.engineTitle')}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{t('pages.scoring.engineDesc')}</p>
      </div>
    </div>
  );
}
