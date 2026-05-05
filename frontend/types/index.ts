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

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Disqualified';
export type EnrichmentStatus = 'Enriched' | 'Partial' | 'Failed' | 'Pending';
export type LeadClassification = 'Hot' | 'Warm' | 'Cold' | 'Reject';

export interface ScoreBreakdown {
  jobTitleMatch: number;    // 0–30
  industryMatch: number;    // 0–25
  companySizeMatch: number; // 0–15
  painMatch: number;        // 0–20
  activitySignals: number;  // 0–10
  total: number;
}

export interface LeadSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  status: LeadStatus;
  source: string;
  importedAt: string;
  icpScore: number | null;
  classification: LeadClassification | null;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  jobTitle: string | null;
  company: string | null;
  companyWebsite: string | null;
  industry: string | null;
  companySize: string | null;
  geography: string | null;
  revenueRange: string | null;
  linkedInUrl: string | null;
  source: string;
  status: LeadStatus;
  enrichmentStatus: EnrichmentStatus | null;
  classification: LeadClassification | null;
  notes: string | null;
  importedAt: string;
  icpScore: number | null;
  scoreBreakdown: ScoreBreakdown | null;
}

// ── ICP ───────────────────────────────────────────────────────────────────────

export interface ICPProfile {
  id: string;
  name: string;
  industries: string[];
  jobTitles: string[];
  companySizeMin: number;
  companySizeMax: number;
  locations: string[];
  decisionMaker: boolean;
  painPoints: string[];
  budgetMin: number;
  budgetMax: number;
  buyingTriggers: string[];
  updatedAt: string;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  timezone: string;
  language: string;
  notifications: {
    newLeads: boolean;
    outreachDrafts: boolean;
    weeklyDigest: boolean;
    emailAlerts: boolean;
  };
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
