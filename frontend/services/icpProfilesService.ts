import { apiFetch, ApiError } from '@/lib/api';
import type { ICPProfile } from '@/types';

// ── Backend response shape ─────────────────────────────────────────────────────

interface ApiIcpProfile {
  id: string;
  name: string;
  isActive: boolean;
  updatedAt: string;
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
}

// ── Mutation payload ───────────────────────────────────────────────────────────

export interface SaveIcpProfileRequest {
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
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapProfile(raw: ApiIcpProfile): ICPProfile {
  return {
    id: raw.id,
    name: raw.name,
    industries: raw.industries ?? [],
    jobTitles: raw.jobTitles ?? [],
    companySizeMin: raw.companySizeMin ?? 0,
    companySizeMax: raw.companySizeMax ?? 0,
    locations: raw.locations ?? [],
    decisionMaker: raw.decisionMaker ?? false,
    painPoints: raw.painPoints ?? [],
    budgetMin: raw.budgetMin ?? 0,
    budgetMax: raw.budgetMax ?? 0,
    buyingTriggers: raw.buyingTriggers ?? [],
    updatedAt: raw.updatedAt,
  };
}

// ── API functions ─────────────────────────────────────────────────────────────

export async function getCurrentIcpProfile(): Promise<ICPProfile | null> {
  try {
    const raw = await apiFetch<ApiIcpProfile>('/api/icp-profiles/current');
    return mapProfile(raw);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function createIcpProfile(data: SaveIcpProfileRequest): Promise<ICPProfile> {
  console.log('[icpProfilesService] createIcpProfile → POST /api/icp-profiles', data);
  const raw = await apiFetch<ApiIcpProfile>('/api/icp-profiles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapProfile(raw);
}

export async function updateIcpProfile(id: string, data: SaveIcpProfileRequest): Promise<ICPProfile> {
  const raw = await apiFetch<ApiIcpProfile | null>(`/api/icp-profiles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!raw) {
    // 204 No Content — reconstruct from the sent payload
    return { id, ...data, updatedAt: new Date().toISOString() };
  }
  return mapProfile(raw);
}
