'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLeads } from '@/services/leadsService';
import type { LeadSummary, LeadStatus } from '@/types';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge, statusVariant, classificationVariant, enrichmentVariant } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLocale } from '@/lib/i18n';

// ── Types ──────────────────────────────────────────────────────────────────────

type StatusFilter = 'All' | LeadStatus;
type SortKey      = 'score-desc' | 'score-asc' | 'name-asc' | 'date-desc';

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_FILTERS: StatusFilter[] = ['All', 'New', 'Qualified', 'Disqualified', 'Unsubscribed'];
const PAGE_SIZE = 20;

const STATUS_DOT: Record<StatusFilter, string> = {
  All:           'bg-indigo-400',
  New:           'bg-slate-400',
  Qualified:     'bg-emerald-500',
  Disqualified:  'bg-red-400',
  Unsubscribed:  'bg-slate-300',
  Contacted:     'bg-blue-400',
};

// ── Status pill ────────────────────────────────────────────────────────────────

function StatusPill({
  label,
  count,
  isActive,
  dotColor,
  onClick,
}: {
  label: string;
  count: number | null;
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
      {count !== null && (
        <span
          className={`min-w-[18px] rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${
            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ── Loading skeleton row ───────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-50">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-3.5 w-28 rounded bg-slate-100 animate-pulse" />
        </div>
      </td>
      <td className="hidden px-4 py-3.5 sm:table-cell">
        <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
      </td>
      <td className="hidden px-4 py-3.5 md:table-cell">
        <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
      </td>
      <td className="hidden px-4 py-3.5 lg:table-cell">
        <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
      </td>
      <td className="hidden px-4 py-3.5 xl:table-cell text-center">
        <div className="mx-auto h-4 w-4 rounded bg-slate-100 animate-pulse" />
      </td>
      <td className="px-4 py-3.5 text-center">
        <div className="mx-auto h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
      </td>
      <td className="px-4 py-3.5">
        <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" />
      </td>
      <td className="px-4 py-3.5" />
    </tr>
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

  const STATUS_LABEL: Record<StatusFilter, string> = {
    All:          t('pages.leads.filterAll'),
    New:          t('pages.leads.filterNew'),
    Qualified:    t('pages.leads.filterQualified'),
    Disqualified: t('pages.leads.filterDisqualified'),
    Unsubscribed: t('pages.leads.filterUnsubscribed'),
    Contacted:    'Contacted',
  };

  // ── State ────────────────────────────────────────────────────────────────────

  const [leads, setLeads]             = useState<LeadSummary[]>([]);
  const [totalCount, setTotalCount]   = useState(0);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [hasError, setHasError]       = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [search, setSearch]           = useState('');
  const [sortBy, setSortBy]           = useState<SortKey>('score-desc');

  // ── Data fetching ─────────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const result = await getLeads({
        page,
        pageSize: PAGE_SIZE,
        status: statusFilter === 'All' ? undefined : statusFilter,
      });
      setLeads(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('[LeadsPage] getLeads failed:', err);
      setLeads([]);
      setTotalCount(0);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Derived values ────────────────────────────────────────────────────────────

  function handleStatusFilter(f: StatusFilter) {
    setStatusFilter(f);
    setPage(1);
  }

  function statusCount(f: StatusFilter): number | null {
    if (f === statusFilter) return totalCount;
    return null;
  }

  const displayLeads = useMemo(() => {
    const q = search.toLowerCase().trim();

    const filtered = q
      ? leads.filter((l) => {
          const hay = `${l.firstName} ${l.lastName} ${l.email} ${l.company ?? ''} ${l.jobTitle ?? ''}`.toLowerCase();
          return hay.includes(q);
        })
      : leads;

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
  }, [leads, search, sortBy]);

  const hasActiveFilters = search !== '' || statusFilter !== 'All';
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  function clearFilters() {
    setSearch('');
    setStatusFilter('All');
    setSortBy('score-desc');
    setPage(1);
  }

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t('pages.leads.title')}
            {!loading && (
              <span className="ml-2 text-base font-normal text-slate-400">({totalCount})</span>
            )}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {t('pages.leads.description')}
          </p>
        </div>
        <Link
          href="/dashboard/leads/new"
          className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 sm:inline-flex"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('pages.leads.addLead')}
        </Link>
      </div>

      {/* ── Error banner ── */}
      {hasError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{t('pages.leads.errorFallback')}</span>
          </div>
          <button
            onClick={fetchLeads}
            className="shrink-0 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {/* ── Status filter pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((f) => (
          <StatusPill
            key={f}
            label={STATUS_LABEL[f]}
            count={statusCount(f)}
            isActive={statusFilter === f}
            dotColor={STATUS_DOT[f] ?? 'bg-slate-400'}
            onClick={() => handleStatusFilter(f)}
          />
        ))}
      </div>

      {/* ── Toolbar: search + sort ── */}
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

        {hasActiveFilters && !loading && (
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
        {loading ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('pages.leads.colFullName')}</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">{t('pages.leads.colJobTitle')}</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:table-cell">{t('pages.leads.colCompany')}</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">{t('pages.leads.colEmail')}</th>
                  <th className="hidden px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 xl:table-cell">{t('pages.leads.colLinkedIn')}</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('pages.leads.colScore')}</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">{t('pages.leads.colClassification')}</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{t('pages.leads.colStatus')}</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : displayLeads.length === 0 ? (
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
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {t('pages.leads.colFullName')}
                  </th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">
                    {t('pages.leads.colJobTitle')}
                  </th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 md:table-cell">
                    {t('pages.leads.colCompany')}
                  </th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                    {t('pages.leads.colEmail')}
                  </th>
                  <th className="hidden px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 xl:table-cell">
                    {t('pages.leads.colLinkedIn')}
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {t('pages.leads.colScore')}
                  </th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">
                    {t('pages.leads.colClassification')}
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {t('pages.leads.colStatus')}
                  </th>
                  <th className="w-10 px-4 py-3" aria-label="View lead" />
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {displayLeads.map((lead) => (
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
                      {'linkedInUrl' in lead && (lead as { linkedInUrl?: string | null }).linkedInUrl ? (
                        <a
                          href={(lead as { linkedInUrl?: string | null }).linkedInUrl!}
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
                    <td className="hidden px-4 py-3.5 lg:table-cell">
                      {lead.classification ? (
                        <Badge variant={classificationVariant(lead.classification)}>
                          {lead.classification}
                        </Badge>
                      ) : (
                        <span className="text-slate-300" aria-label="Not classified">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <Badge variant={statusVariant(lead.status)}>
                        {lead.status}
                      </Badge>
                    </td>

                    {/* Chevron */}
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

      {/* ── Footer: count + pagination ── */}
      {!loading && displayLeads.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {t('pages.leads.showingCount')
              .replace('{visible}', String(displayLeads.length))
              .replace('{total}', String(totalCount))}
          </span>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="font-medium text-indigo-500 transition-colors hover:text-indigo-700"
              >
                {t('pages.leads.clearFilters')}
              </button>
            )}

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('pages.leads.prevPage')}
                </button>
                <span className="tabular-nums">
                  {t('pages.leads.pageInfo')
                    .replace('{page}', String(page))
                    .replace('{pages}', String(totalPages))}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('pages.leads.nextPage')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
