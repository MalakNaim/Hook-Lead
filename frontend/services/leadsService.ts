import { apiFetch } from '@/lib/api';
import type { Lead, LeadSummary, PagedResult } from '@/types';

export interface GetLeadsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  minScore?: number;
  maxScore?: number;
}

export async function getLeads(
  params: GetLeadsParams = {},
): Promise<PagedResult<LeadSummary>> {
  const qs = new URLSearchParams();
  if (params.page)     qs.set('pageNumber', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  if (params.status)   qs.set('status', params.status);
  if (params.minScore !== undefined) qs.set('minScore', String(params.minScore));
  if (params.maxScore !== undefined) qs.set('maxScore', String(params.maxScore));

  const query = qs.toString() ? `?${qs.toString()}` : '';
  return apiFetch<PagedResult<LeadSummary>>(`/leads${query}`);
}

export async function getLeadById(leadId: string): Promise<Lead> {
  return apiFetch<Lead>(`/leads/${leadId}`);
}
