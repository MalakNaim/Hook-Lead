'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DUMMY_LEADS } from '@/lib/dummy-data';
import type { LeadClassification } from '@/types';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge, classificationVariant, enrichmentVariant } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLocale } from '@/lib/i18n';

// ── Types ──────────────────────────────────────────────────────────────────────

type ClassFilter   = LeadClassification | 'All' | 'Unclassified';
type EnrichFilter  = 'All' | 'Enriched' | 'Partial' | 'Failed';
type SortKey       = 'score-desc' | 'score-asc' | 'name-asc' | 'date-desc';

// ── Constants ──────────────────────────────────────────────────────────────────

const CLASS_FILTERS: ClassFilter[]   = ['All', 'Hot', 'Warm', 'Cold', 'Reject', 'Unclassified'];
const ENRICH_FILTERS: EnrichFilter[] = ['All', 'Enriched', 'Partial', 'Failed'];

const CLASS_DOT: Record<string, string> = {
  Hot:          'bg-rose-500',
  Warm:         'bg-orange-400',
  Cold:         'bg-sky-500',
  Reject:       'bg-slate-400',
  Unclassified: 'bg-slate-300',
  All:          'bg-indigo-400',
};

// ── Classification pill ────────────────────────────────────────────────────────

function ClassPill({
  label,
  count,
  isActive,
  dotColor,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  dotColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
        isActive
          ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${isActive ? 'bg-white/70' : dotColor}`} />
      {label}
      <span
        className={`min-w-[18px] rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${
          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const router = useRouter();
  const { t } = useLocale();

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'score-desc', label: t('pages.leads.sortScoreDesc') },
    { value: 'score-asc',  label: t('pages.leads.sortScoreAsc') },
    { value: 'name-asc',   label: t('pages.leads.sortNameAsc') },
    { value: 'date-desc',  label: t('pages.leads.sortDateDesc') },
  ];

  const CLASS_LABEL: Record<ClassFilter, string> = {
    All:          t('pages.leads.filterAll'),
    Hot:          t('pages.leads.filterHot'),
    Warm:         t('pages.leads.filterWarm'),
    Cold:         t('pages.leads.filterCold'),
    Reject:       t('pages.leads.filterReject'),
    Unclassified: t('pages.leads.filterUnclassified'),
  };

  const ENRICH_LABEL: Record<EnrichFilter, string> = {
    All:      t('pages.leads.allEnrichment'),
    Enriched: t('pages.leads.enriched'),
    Partial:  t('pages.leads.partial'),
    Failed:   t('pages.leads.failed'),
  };

  const [search, setSearch]             = useState('');
  const [classFilter, setClassFilter]   = useState<ClassFilter>('All');
  const [enrichFilter, setEnrichFilter] = useState<EnrichFilter>('All');
  const [sortBy, setSortBy]             = useState<SortKey>('score-desc');

  function classCount(f: ClassFilter) {
    if (f === 'All') return DUMMY_LEADS.length;
    if (f === 'Unclassified') return DUMMY_LEADS.filter((l) => !l.classification).length;
    return DUMMY_LEADS.filter((l) => l.classification === f).length;
  }

  const leads = useMemo(() => {
    const q = search.toLowerCase().trim();

    const filtered = DUMMY_LEADS.filter((l) => {
      if (classFilter !== 'All') {
        if (classFilter === 'Unclassified' ? l.classification !== null : l.classification !== classFilter)
          return false;
      }
      if (enrichFilter !== 'All' && l.enrichmentStatus !== enrichFilter) return false;
      if (q) {
        const hay = `${l.firstName} ${l.lastName} ${l.email} ${l.company ?? ''} ${l.jobTitle ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'score-desc': return (b.icpScore ?? -1) - (a.icpScore ?? -1);
        case 'score-asc':  return (a.icpScore ?? 101) - (b.icpScore ?? 101);
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'date-desc':
          return new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime();
        default: return 0;
      }
    });
  }, [search, classFilter, enrichFilter, sortBy]);

  const hasActiveFilters = search !== '' || classFilter !== 'All' || enrichFilter !== 'All';

  function clearFilters() {
    setSearch('');
    setClassFilter('All');
    setEnrichFilter('All');
    setSortBy('score-desc');
  }

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t('pages.leads.title')}
            <span className="ml-2 text-base font-normal text-slate-400">({DUMMY_LEADS.length})</span>
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {t('pages.leads.description')}
          </p>
        </div>
        <button
          disabled
          title={t('pages.leads.importComingSoon')}
          className="hidden shrink-0 cursor-not-allowed items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white opacity-40 sm:inline-flex"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {t('pages.leads.importLeads')}
        </button>
      </div>

      {/* ── Classification filter pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CLASS_FILTERS.map((f) => (
          <ClassPill
            key={f}
            label={CLASS_LABEL[f]}
            count={classCount(f)}
            isActive={classFilter === f}
            dotColor={CLASS_DOT[f] ?? 'bg-slate-400'}
            onClick={() => setClassFilter(f)}
          />
        ))}
      </div>

      {/* ── Toolbar: search + sort + enrichment ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
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
            placeholder={t('pages.leads.searchPlaceholder')}
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-slate-700 focus:outline-none"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-8 text-sm text-slate-700 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Enrichment segmented filter */}
        <div
          className="flex overflow-hidden rounded-lg border border-slate-300 bg-white"
          role="group"
          aria-label="Filter by enrichment status"
        >
          {ENRICH_FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setEnrichFilter(f)}
              className={`px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500 ${
                i > 0 ? 'border-l border-slate-300' : ''
              } ${
                enrichFilter === f
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {ENRICH_LABEL[f]}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            {t('pages.leads.clearFilters')}
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {leads.length === 0 ? (
          <EmptyState
            title={search ? t('pages.leads.emptySearchTitle').replace('{search}', search) : t('pages.leads.emptyTitle')}
            description={
              hasActiveFilters
                ? t('pages.leads.emptyFilterDesc')
                : t('pages.leads.emptyDesc')
            }
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.477-3.765M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a4 4 0 015.477-3.765M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            action={
              hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                >
                  {t('pages.leads.clearAllFilters')}
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">

                  {/* Name — always visible */}
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {t('pages.leads.colFullName')}
                  </th>

                  {/* Job Title — sm+ */}
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
                    {t('pages.leads.colJobTitle')}
                  </th>

                  {/* Company — md+ */}
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                    {t('pages.leads.colCompany')}
                  </th>

                  {/* Email — lg+ */}
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                    {t('pages.leads.colEmail')}
                  </th>

                  {/* LinkedIn — xl+ */}
                  <th className="hidden px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 xl:table-cell">
                    {t('pages.leads.colLinkedIn')}
                  </th>

                  {/* Score — always */}
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {t('pages.leads.colScore')}
                  </th>

                  {/* Classification — always */}
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {t('pages.leads.colClassification')}
                  </th>

                  {/* Enrichment — md+ */}
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                    {t('pages.leads.colEnrichment')}
                  </th>

                  {/* Actions — always */}
                  <th className="w-10 px-4 py-3" aria-label="View lead" />
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                    className="group cursor-pointer transition-colors hover:bg-indigo-50/40"
                  >

                    {/* Full Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700 select-none">
                          {lead.firstName[0]}{lead.lastName[0]}
                        </div>
                        <p className="max-w-[130px] truncate font-semibold text-slate-900 transition-colors group-hover:text-indigo-700">
                          {lead.firstName} {lead.lastName}
                        </p>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="hidden px-4 py-3.5 sm:table-cell">
                      <p className="max-w-[140px] truncate text-slate-700">
                        {lead.jobTitle ?? <span className="text-slate-300">—</span>}
                      </p>
                    </td>

                    {/* Company */}
                    <td className="hidden px-4 py-3.5 md:table-cell">
                      <p className="max-w-[130px] truncate font-medium text-slate-700">
                        {lead.company ?? <span className="font-normal text-slate-300">—</span>}
                      </p>
                    </td>

                    {/* Email */}
                    <td className="hidden px-4 py-3.5 lg:table-cell">
                      <p className="max-w-[180px] truncate text-xs text-slate-500 tabular-nums">
                        {lead.email}
                      </p>
                    </td>

                    {/* LinkedIn */}
                    <td className="hidden px-4 py-3.5 text-center xl:table-cell">
                      {lead.linkedInUrl ? (
                        <a
                          href={lead.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${lead.firstName} ${lead.lastName} on LinkedIn`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-[#0077b5]"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-slate-200" aria-hidden="true">—</span>
                      )}
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3.5 text-center">
                      {lead.icpScore !== null ? (
                        <div className="flex justify-center">
                          <ScoreRing score={lead.icpScore} size="sm" />
                        </div>
                      ) : (
                        <span className="text-slate-300" aria-label="Not scored">—</span>
                      )}
                    </td>

                    {/* Classification */}
                    <td className="px-4 py-3.5">
                      {lead.classification ? (
                        <Badge variant={classificationVariant(lead.classification)}>
                          {lead.classification}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Enrichment */}
                    <td className="hidden px-4 py-3.5 md:table-cell">
                      {lead.enrichmentStatus ? (
                        <Badge variant={enrichmentVariant(lead.enrichmentStatus)}>
                          {lead.enrichmentStatus}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>

                    {/* Actions — chevron that animates on row hover */}
                    <td className="px-4 py-3.5">
                      <svg
                        className="h-4 w-4 text-slate-300 transition-colors group-hover:text-indigo-500"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {leads.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {t('pages.leads.showingCount')
              .replace('{visible}', String(leads.length))
              .replace('{total}', String(DUMMY_LEADS.length))}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="font-medium text-indigo-500 transition-colors hover:text-indigo-700"
            >
              {t('pages.leads.clearFilters')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
