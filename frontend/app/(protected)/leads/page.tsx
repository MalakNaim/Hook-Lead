'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLeads } from '@/services/leadsService';
import type { LeadSummary, PagedResult } from '@/types';

function statusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'new':          return 'bg-blue-50 text-blue-700';
    case 'contacted':    return 'bg-amber-50 text-amber-700';
    case 'qualified':    return 'bg-green-50 text-green-700';
    case 'disqualified': return 'bg-red-50 text-red-700';
    default:             return 'bg-gray-100 text-gray-600';
  }
}

function scoreClass(score: number | null): string {
  if (score === null) return 'text-gray-400';
  if (score >= 71) return 'text-green-600 font-semibold';
  if (score >= 41) return 'text-amber-600 font-semibold';
  return 'text-red-500 font-semibold';
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [result, setResult] = useState<PagedResult<LeadSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLeads({ pageSize: 20 })
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load leads.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-8 text-sm text-gray-500">
          <Spinner />
          Loading leads…
        </div>
      )}

      {result && (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {result.totalCount} lead{result.totalCount !== 1 ? 's' : ''}
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Company / Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">ICP Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <p className="text-base font-medium text-gray-400">No leads yet</p>
                      <p className="mt-1 text-sm text-gray-400">Import leads to get started.</p>
                    </td>
                  </tr>
                ) : (
                  result.items.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/leads/${lead.id}`)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{lead.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900">{lead.company ?? '—'}</span>
                        {lead.jobTitle && (
                          <span className="block text-xs text-gray-400">{lead.jobTitle}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right ${scoreClass(lead.icpScore)}`}>
                        {lead.icpScore !== null ? lead.icpScore : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
