'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLeads } from '@/services/leadsService';
import type { LeadSummary, PagedResult } from '@/types';

export default function LeadsPage() {
  const [result, setResult] = useState<PagedResult<LeadSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLeads({ pageSize: 20 })
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load leads.'));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {!result && !error && (
        <p className="text-sm text-gray-500">Loading…</p>
      )}

      {result && (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {result.totalCount} lead{result.totalCount !== 1 ? 's' : ''}
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">ICP Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.items.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {lead.firstName} {lead.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.company ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.icpScore !== null ? lead.icpScore : '—'}
                    </td>
                  </tr>
                ))}
                {result.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      No leads yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
