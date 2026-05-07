import { apiFetch } from '@/lib/api';
import type { Lead, LeadSummary, LeadStatus, PagedResult, ScoreBreakdown } from '@/types';

// ── Mutation payloads ──────────────────────────────────────────────────────────

export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  company?: string;
  industry?: string;
  companySize?: string;
  geography?: string;
  revenueRange?: string;
  linkedInUrl?: string;
  notes?: string;
}

// ── Query params ───────────────────────────────────────────────────────────────

export interface GetLeadsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  minScore?: number;
  maxScore?: number;
}

// ── Backend response shapes (what /api/leads actually returns) ─────────────────

interface ApiLeadSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  status: string;
  source: string;
  importedAt: string;
  icpScore: number | null;
}

interface ApiLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string | null;
  company: string | null;
  industry: string | null;
  companySize: string | null;
  geography: string | null;
  revenueRange: string | null;
  linkedInUrl: string | null;
  source: string;
  status: string;
  notes: string | null;
  importedAt: string;
  icpScore: number | null;
  scoreBreakdown: string | null;
}

interface ApiPagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// ── Mappers ────────────────────────────────────────────────────────────────────

function parseScoreBreakdown(raw: string | null): ScoreBreakdown | null {
  if (!raw) return null;
  try {
    const parsed: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return parsed as ScoreBreakdown;
  } catch {
    return null;
  }
}

function mapApiSummary(api: ApiLeadSummary): LeadSummary {
  return {
    id: api.id,
    firstName: api.firstName,
    lastName: api.lastName,
    email: api.email,
    company: api.company,
    jobTitle: api.jobTitle,
    status: api.status as LeadStatus,
    source: api.source,
    importedAt: api.importedAt,
    icpScore: api.icpScore,
    classification: null,
  };
}

function mapApiLead(api: ApiLead): Lead {
  return {
    id: api.id,
    firstName: api.firstName,
    lastName: api.lastName,
    email: api.email,
    phone: null,
    whatsapp: null,
    jobTitle: api.jobTitle,
    company: api.company,
    companyWebsite: null,
    industry: api.industry,
    companySize: api.companySize,
    geography: api.geography,
    revenueRange: api.revenueRange,
    linkedInUrl: api.linkedInUrl,
    source: api.source,
    status: api.status as LeadStatus,
    enrichmentStatus: null,
    classification: null,
    notes: api.notes,
    importedAt: api.importedAt,
    icpScore: api.icpScore,
    scoreBreakdown: parseScoreBreakdown(api.scoreBreakdown),
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

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
  const raw = await apiFetch<ApiPagedResult<ApiLeadSummary>>(`/api/leads${query}`);
  return {
    items: raw.items.map(mapApiSummary),
    totalCount: raw.totalCount,
    pageNumber: raw.pageNumber,
    pageSize: raw.pageSize,
  };
}

export async function getLeadById(leadId: string): Promise<Lead> {
  const raw = await apiFetch<ApiLead>(`/api/leads/${leadId}`);
  return mapApiLead(raw);
}

export async function updateLeadStatus(leadId: string, status: string): Promise<Lead> {
  const raw = await apiFetch<ApiLead>(`/api/leads/${leadId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return mapApiLead(raw);
}

export async function createLead(payload: CreateLeadRequest): Promise<Lead> {
  const raw = await apiFetch<ApiLead>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapApiLead(raw);
}

export async function addLeadNote(leadId: string, note: string): Promise<Lead> {
  const raw = await apiFetch<ApiLead>(`/api/leads/${leadId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
  return mapApiLead(raw);
}
