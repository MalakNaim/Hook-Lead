import { getAccessToken } from '@/lib/auth';
import { ApiError } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5057';

export interface ImportPreviewRow {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  jobTitle: string | null;
  company: string | null;
  industry: string | null;
  companySize: string | null;
  geography: string | null;
  revenueRange: string | null;
  linkedInUrl: string | null;
  isValid: boolean;
  validationError: string | null;
}

export interface ImportPreviewResult {
  rows: ImportPreviewRow[];
  validCount: number;
  invalidCount: number;
}

export interface ImportSummaryResult {
  imported: number;
  skipped: number;
  total: number;
}

async function importFetch<T>(path: string, init: RequestInit): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function previewCsvImport(file: File): Promise<ImportPreviewResult> {
  const formData = new FormData();
  formData.append('file', file);

  return importFetch<ImportPreviewResult>('/api/import/csv/preview', {
    method: 'POST',
    body: formData,
  });
}

export async function confirmCsvImport(
  rows: ImportPreviewRow[],
): Promise<ImportSummaryResult> {
  const payload = {
    rows: rows.map((r) => ({
      firstName: r.firstName ?? '',
      lastName: r.lastName ?? '',
      email: r.email ?? '',
      jobTitle: r.jobTitle ?? null,
      company: r.company ?? null,
      industry: r.industry ?? null,
      companySize: r.companySize ?? null,
      geography: r.geography ?? null,
      revenueRange: r.revenueRange ?? null,
      linkedInUrl: r.linkedInUrl ?? null,
    })),
  };

  return importFetch<ImportSummaryResult>('/api/import/csv/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
