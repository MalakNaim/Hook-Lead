// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  role: string;
  workspaceId: string;
  workspaceName: string;
}

// ── Shared ────────────────────────────────────────────────────────────────────

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export interface LeadSummary {
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

export interface Lead {
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

// ── Outreach ──────────────────────────────────────────────────────────────────

export type OutreachStatus = 'Draft' | 'Sent' | 'Cancelled';

export interface OutreachMessage {
  id: string;
  leadId: string;
  subject: string;
  body: string;
  status: OutreachStatus;
  createdAt: string;
  sentAt: string | null;
}

export interface OutreachEmailDraftResult {
  to: string;
  subject: string;
  body: string;
  mailtoUrl: string;
}
