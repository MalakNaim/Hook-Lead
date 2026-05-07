import { apiFetch } from '@/lib/api';
import type {
  Lead, LeadSummary, LeadStatus, EmailVerificationStatus, EnrichmentStatus,
  LeadClassification, QualificationStatus, HandoffStatus, PagedResult, ScoreBreakdown,
} from '@/types';

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
  companyWebsite?: string;
  phone?: string;
  whatsApp?: string;
  emailVerificationStatus?: string;
  enrichmentStatus?: string;
  source?: string;
}

// ── Query params ───────────────────────────────────────────────────────────────

export interface GetLeadsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  minScore?: number;
  maxScore?: number;
}

// ── Backend response shapes ────────────────────────────────────────────────────

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
  classification: string | null;
  enrichmentStatus: string;
  emailVerificationStatus: string;
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
  companyWebsite: string | null;
  phone: string | null;
  whatsApp: string | null;
  emailVerificationStatus: string;
  enrichmentStatus: string;
  source: string;
  status: string;
  notes: string | null;
  importedAt: string;
  jobTitleMatchScore: number;
  industryMatchScore: number;
  companySizeMatchScore: number;
  painMatchScore: number;
  activitySignalsScore: number;
  icpScore: number | null;
  scoreBreakdown: string | null;
  classification: string | null;
  qualificationStatus: string;
  qualificationNotes: string | null;
  icpProfileId: string | null;
  matchedCriteria: string | null;
  mismatchReasons: string | null;
  handoffStatus: string;
  handoffTarget: string | null;
  handoffAt: string | null;
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
    classification: (api.classification as LeadClassification | null) ?? null,
    enrichmentStatus: (api.enrichmentStatus as EnrichmentStatus) ?? 'Unknown',
    emailVerificationStatus: (api.emailVerificationStatus as EmailVerificationStatus) ?? 'Unknown',
  };
}

function mapApiLead(api: ApiLead): Lead {
  return {
    id: api.id,
    firstName: api.firstName,
    lastName: api.lastName,
    email: api.email,
    jobTitle: api.jobTitle,
    company: api.company,
    industry: api.industry,
    companySize: api.companySize,
    geography: api.geography,
    revenueRange: api.revenueRange,
    linkedInUrl: api.linkedInUrl,
    companyWebsite: api.companyWebsite,
    phone: api.phone,
    whatsapp: api.whatsApp,
    emailVerificationStatus: (api.emailVerificationStatus as EmailVerificationStatus) ?? 'Unknown',
    enrichmentStatus: (api.enrichmentStatus as EnrichmentStatus) ?? 'Unknown',
    source: api.source,
    status: api.status as LeadStatus,
    notes: api.notes,
    importedAt: api.importedAt,
    jobTitleMatchScore: api.jobTitleMatchScore ?? 0,
    industryMatchScore: api.industryMatchScore ?? 0,
    companySizeMatchScore: api.companySizeMatchScore ?? 0,
    painMatchScore: api.painMatchScore ?? 0,
    activitySignalsScore: api.activitySignalsScore ?? 0,
    icpScore: api.icpScore,
    scoreBreakdown: parseScoreBreakdown(api.scoreBreakdown),
    classification: (api.classification as LeadClassification | null) ?? null,
    qualificationStatus: (api.qualificationStatus as QualificationStatus) ?? 'Unknown',
    qualificationNotes: api.qualificationNotes,
    icpProfileId: api.icpProfileId,
    matchedCriteria: api.matchedCriteria,
    mismatchReasons: api.mismatchReasons,
    handoffStatus: (api.handoffStatus as HandoffStatus) ?? 'NotReady',
    handoffTarget: api.handoffTarget,
    handoffAt: api.handoffAt,
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
